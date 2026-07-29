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

    // Step 2: Load Active Security Duty Posts sorted by Priority (Priority 1 Critical Posts first)
    const activePosts = await prisma.securitypostmaster.findMany({
      where: { Enable: 'Y' },
      include: { postCategory: true, location: true },
      orderBy: [
        { Priority: 'asc' },     // Priority 1 (Critical) first, then 2, 3, 4...
        { PostCode: 'asc' },
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
          include: { personal: true, dates: true, category: true },
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

    // Helper function: Attempts to allocate a guard to an eligible post under target capacity mode ('MIN' or 'MAX')
    const tryAllocateGuard = async (attendance, passMode) => {
      const emp = attendance.employee;
      if (!emp || alreadyDeployedEmpNos.has(emp.EmpNo)) return false;

      const empCategory = emp.CategoryCode || 1; // 1: Un-Skilled, 2: Semi-Skilled, 3: Skilled, 4: High-Skilled

      // Dynamically sort candidate posts for this allocation step
      const candidatePosts = [...activePosts].sort((a, b) => {
        // Primary: Priority ASC (Priority 1 Critical Posts first)
        if (a.Priority !== b.Priority) return a.Priority - b.Priority;

        // Secondary: CriticalPost DESC ('Y' first)
        if (a.CriticalPost !== b.CriticalPost) {
          return a.CriticalPost === 'Y' ? -1 : 1;
        }

        // Tertiary: Vacant Shortage to MinimumGuards DESC (Posts with largest unfilled gap get filled first)
        const shortageA = a.MinimumGuards - (postCurrentCounts[a.PostCode] || 0);
        const shortageB = b.MinimumGuards - (postCurrentCounts[b.PostCode] || 0);
        if (shortageA !== shortageB) return shortageB - shortageA;

        // Quaternary: PostCode ASC (Stable tie-breaker)
        return a.PostCode - b.PostCode;
      });

      for (const post of candidatePosts) {
        const currentCount = postCurrentCounts[post.PostCode] || 0;
        const capLimit = passMode === 'MIN' ? post.MinimumGuards : post.MaximumGuards;

        // Constraint A: Check capacity limit for this pass
        if (currentCount >= capLimit) continue;

        // Constraint B: Check Female-Only Restriction
        if (activeRule.GenderBasedAllocation === 'Y' && post.FemaleOnly === 'Y' && emp.Gender !== 'F') {
          continue;
        }

        // Constraint C: Skill Category Matching Rules
        if (activeRule.SkillBasedAllocation === 'Y') {
          if (post.Priority === 1) {
            // Priority 1 (Critical Posts): Only High-Skilled (4) or Skilled (3) guards
            if (empCategory !== 4 && empCategory !== 3) {
              continue;
            }
          } else if (post.Priority === 2 || post.Priority === 3) {
            // Priority 2 & 3 Posts: Only Semi-Skilled (2) guards
            if (empCategory !== 2) {
              continue;
            }
          } else if (post.Priority === 4 || post.Priority === 5) {
            // Priority 4 & 5 Posts: Only Un-Skilled (1) guards
            if (empCategory !== 1) {
              continue;
            }
          }
        }

        // Post matches all rules for this pass! Execute DB transaction allocation
        await prisma.$transaction(async (tx) => {
          const deployment = await tx.securitydeployment.create({
            data: {
              DeploymentDate: targetDate,
              EmpNo: emp.EmpNo,
              PostCode: post.PostCode,
              ShiftCode: Number(shiftCode),
              ReportingTime: attendance.PunchDateTime,
              AllocationMethod: 'AUTO',
              DeploymentStatus: 'ALLOCATED',
              Remarks: `Auto allocated to ${post.PostName} (${passMode} pass)`,
            },
          });

          await tx.securitydeploymenthistory.create({
            data: {
              DeploymentCode: deployment.DeploymentCode,
              EmpNo: emp.EmpNo,
              PostCode: post.PostCode,
              ShiftCode: Number(shiftCode),
              DeploymentStatus: 'ALLOCATED',
              ActionType: 'CREATED',
              ChangedBy: emp.EmpNo,
              Remarks: `Automatic Guard Allocation Engine (${passMode} pass)`,
            },
          });

          await tx.securityattendance.update({
            where: { AttendanceCode: attendance.AttendanceCode },
            data: { AttendanceStatus: 'ALLOCATED', Remarks: `Allocated to ${post.PostName}` },
          });
        });

        alreadyDeployedEmpNos.add(emp.EmpNo);
        postCurrentCounts[post.PostCode] = (postCurrentCounts[post.PostCode] || 0) + 1;
        allocatedCount++;
        logger.info(`Guard ${emp.EmpNo} (${emp.FirstName} ${emp.LastName}) allocated to Post: ${post.PostName} [Priority ${post.Priority}] (${passMode} pass)`);

        // Trigger Automated Email Dispatch to Guard
        emailService.sendGuardDeploymentEmail({
          empNo: emp.EmpNo,
          deploymentDate: targetDate,
          shiftName: `Shift ${shiftCode}`,
          postName: post.PostName,
          categoryName: post.postCategory?.PostCategoryName || 'Security Gate',
          locationName: post.location?.Location || 'Plant Premises',
          isCritical: post.CriticalPost === 'Y',
          remarks: `Automatically allocated by SPPAS Engine to ${post.PostName}`,
        });

        return true;
      }

      return false;
    };

    // PASS 1: Minimum Required Capacity Pass (Fulfill MinimumGuards across Priority tiers first)
    for (const attendance of pendingAttendances) {
      await tryAllocateGuard(attendance, 'MIN');
    }

    // PASS 2: Maximum Buffer Capacity Pass (Allocate remaining unassigned guards up to MaximumGuards in Priority order)
    for (const attendance of pendingAttendances) {
      if (!alreadyDeployedEmpNos.has(attendance.EmpNo)) {
        await tryAllocateGuard(attendance, 'MAX');
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
