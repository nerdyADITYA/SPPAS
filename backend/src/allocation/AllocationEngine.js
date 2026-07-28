const { prisma } = require('../config/prisma');
const { logger } = require('../config/logger');
const emailService = require('../services/emailService');

class AllocationEngine {
  /**
   * Main Automatic Allocation Engine Algorithm
   * @param {string|Date} dateStr - Target date
   * @param {number} shiftCode - Shift Code
   */
  async runAllocation(dateStr, shiftCode) {
    const d = dateStr ? new Date(dateStr) : new Date();
    const dateFormatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const targetDate = new Date(dateFormatted);

    logger.info(`Starting Automatic Guard Allocation Cycle for Date: ${dateFormatted}, Shift: ${shiftCode}`);

    // Step 1: Load Active Allocation Rules
    const activeRule = await prisma.securityallocationrulemaster.findFirst({
      where: { Enable: 'Y' },
      orderBy: { RulePriority: 'asc' },
    });

    if (!activeRule) {
      logger.warn('No active allocation rule found. Engine skipping allocation.');
      return { success: false, message: 'No active allocation rule configured.' };
    }

    // Step 2: Load Active Security Duty Posts sorted by CriticalPost & Priority
    const activePosts = await prisma.securitypostmaster.findMany({
      where: { Enable: 'Y' },
      include: { postCategory: true, location: true },
      orderBy: [
        { CriticalPost: 'desc' }, // 'Y' first
        { Priority: 'asc' },     // 1, 2, 3...
      ],
    });

    if (activePosts.length === 0) {
      logger.warn('No active duty posts found.');
      return { success: false, message: 'No active duty posts available.' };
    }

    // Step 3: Load Pending Attendance Records for Target Date & Shift
    const pendingAttendances = await prisma.securityattendance.findMany({
      where: {
        PunchDate: targetDate,
        ShiftCode: Number(shiftCode),
        AttendanceStatus: 'PENDING',
      },
      include: {
        employee: {
          include: { personal: true, dates: true },
        },
      },
      orderBy: { PunchTime: 'asc' }, // Earlier reporting time first
    });

    if (pendingAttendances.length === 0) {
      logger.info(`No pending attendance records for Date: ${dateFormatted}, Shift: ${shiftCode}`);
      return { success: true, allocatedCount: 0, message: 'No pending attendance records.' };
    }

    // Load Existing Deployments for today
    const existingDeployments = await prisma.securitydeployment.findMany({
      where: {
        DeploymentDate: targetDate,
        ShiftCode: Number(shiftCode),
      },
    });

    const alreadyDeployedEmpNos = new Set(existingDeployments.map((d) => d.EmpNo));

    // Post current count map
    const postCurrentCounts = {};
    for (const p of activePosts) {
      postCurrentCounts[p.PostCode] = existingDeployments.filter((d) => d.PostCode === p.PostCode).length;
    }

    let allocatedCount = 0;

    // Step 4: Iterate over Pending Attendance Records
    for (const attendance of pendingAttendances) {
      const emp = attendance.employee;
      if (!emp) continue;

      // Skip if guard is already deployed today
      if (alreadyDeployedEmpNos.has(emp.EmpNo)) {
        logger.info(`Guard ${emp.EmpNo} already deployed for this shift. Skipping.`);
        continue;
      }

      // Step 5: Find Highest Priority Eligible Vacant Post
      let selectedPost = null;

      for (const post of activePosts) {
        const currentCount = postCurrentCounts[post.PostCode] || 0;

        // Constraint A: Check Capacity Limit (MaximumGuards)
        if (currentCount >= post.MaximumGuards) {
          continue; // Post full
        }

        // Constraint B: Check Female-Only Restriction
        if (activeRule.GenderBasedAllocation === 'Y' && post.FemaleOnly === 'Y' && emp.Gender !== 'F') {
          continue; // Guard is not female
        }

        // Selected post meets all rules!
        selectedPost = post;
        break;
      }

      if (selectedPost) {
        // Create Deployment in DB Transaction
        await prisma.$transaction(async (tx) => {
          const deployment = await tx.securitydeployment.create({
            data: {
              DeploymentDate: targetDate,
              EmpNo: emp.EmpNo,
              PostCode: selectedPost.PostCode,
              ShiftCode: Number(shiftCode),
              ReportingTime: attendance.PunchDateTime,
              AllocationMethod: 'AUTO',
              DeploymentStatus: 'ALLOCATED',
              Remarks: `Auto allocated to ${selectedPost.PostName}`,
            },
          });

          // Create History Entry
          await tx.securitydeploymenthistory.create({
            data: {
              DeploymentCode: deployment.DeploymentCode,
              EmpNo: emp.EmpNo,
              PostCode: selectedPost.PostCode,
              ShiftCode: Number(shiftCode),
              DeploymentStatus: 'ALLOCATED',
              ActionType: 'CREATED',
              ChangedBy: emp.EmpNo,
              Remarks: 'Automatic Guard Allocation Engine',
            },
          });

          // Mark Attendance as ALLOCATED
          await tx.securityattendance.update({
            where: { AttendanceCode: attendance.AttendanceCode },
            data: { AttendanceStatus: 'ALLOCATED', Remarks: `Allocated to ${selectedPost.PostName}` },
          });
        });

        alreadyDeployedEmpNos.add(emp.EmpNo);
        postCurrentCounts[selectedPost.PostCode] = (postCurrentCounts[selectedPost.PostCode] || 0) + 1;
        allocatedCount++;
        logger.info(`Guard ${emp.EmpNo} (${emp.FirstName} ${emp.LastName}) allocated to Post: ${selectedPost.PostName}`);

        // Trigger Automated Email Dispatch to Guard
        emailService.sendGuardDeploymentEmail({
          empNo: emp.EmpNo,
          deploymentDate: targetDate,
          shiftName: `Shift ${shiftCode}`,
          postName: selectedPost.PostName,
          categoryName: selectedPost.postCategory?.PostCategoryName || 'Security Gate',
          locationName: selectedPost.location?.Location || 'Plant Premises',
          isCritical: selectedPost.CriticalPost === 'Y',
          remarks: `Automatically allocated by SPPAS Engine to ${selectedPost.PostName}`,
        });
      } else {
        logger.warn(`No suitable vacant post available for Guard ${emp.EmpNo}`);
      }
    }

    // Step 6: Update Vacancy Table
    await this.updateVacancyStatistics(targetDate, shiftCode, activePosts);

    // Step 7: Check Critical Posts Vacancy & Raise Alert if needed
    const criticalVacancies = [];

    for (const post of activePosts) {
      if (post.CriticalPost === 'Y') {
        const count = postCurrentCounts[post.PostCode] || 0;
        if (count < post.MinimumGuards) {
          const vacantShortage = post.MinimumGuards - count;
          await prisma.securityalertlog.create({
            data: {
              AlertType: 'VACANT_POST',
              Severity: 'CRITICAL',
              PostCode: post.PostCode,
              AlertMessage: `CRITICAL POST VACANCY ALERT: Post '${post.PostName}' is short by ${vacantShortage} guard(s). Minimum required: ${post.MinimumGuards}, Current: ${count}.`,
              Resolved: 'N',
            },
          });
          criticalVacancies.push({
            postName: post.PostName,
            categoryName: post.postCategory?.PostCategoryName || 'Critical Infrastructure',
            locationName: post.location?.Location || 'Plant Sector',
            required: post.MinimumGuards,
            allocated: count,
            vacant: vacantShortage,
          });
          logger.warn(`Alert logged: Critical Post '${post.PostName}' has ${vacantShortage} vacant position(s).`);
        }
      }
    }

    // Trigger Urgent Email Alert to SuperAdmins & Admins if Critical Posts remain unfilled
    if (criticalVacancies.length > 0) {
      emailService.sendCriticalPostAlertToAdmins({
        dateStr: dateFormatted,
        shiftCode,
        vacancies: criticalVacancies,
      });
    }

    return {
      success: true,
      allocatedCount,
      message: `Allocated ${allocatedCount} guards successfully.`,
    };
  }

  /**
   * Recalculates and updates duty post vacancy metrics in securitypostvacancy
   */
  async updateVacancyStatistics(vacancyDate, shiftCode, activePosts) {
    const vacancyRepository = require('../repositories/VacancyRepository');
    const existingDeployments = await prisma.securitydeployment.findMany({
      where: {
        DeploymentDate: new Date(vacancyDate),
        ShiftCode: Number(shiftCode),
        DeploymentStatus: { in: ['ALLOCATED', 'REPORTED', 'COMPLETED'] },
      },
    });

    for (const post of activePosts) {
      const allocated = existingDeployments.filter((d) => d.PostCode === post.PostCode).length;
      await vacancyRepository.upsertVacancy(
        vacancyDate,
        post.PostCode,
        shiftCode,
        post.MinimumGuards,
        allocated,
        allocated
      );
    }
  }
}

module.exports = new AllocationEngine();
