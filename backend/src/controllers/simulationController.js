const { prisma } = require('../config/prisma');
const { getIO } = require('../websocket/socketServer');
const allocationEngine = require('../allocation/AllocationEngine');
const { sendSuccess, sendError } = require('../utils/apiResponse');

function getNormalizedToday() {
  const now = new Date();
  const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return new Date(dateFormatted);
}

class SimulationController {
  async getUnpunchedGuards(req, res, next) {
    try {
      const today = getNormalizedToday();

      // Find guards who have already punched today
      const punchedRecords = await prisma.securityattendance.findMany({
        where: { PunchDate: today },
        select: { EmpNo: true },
      });
      const punchedEmpNos = punchedRecords.map((r) => r.EmpNo);

      // Find active guards not in punched list
      const guards = await prisma.employeemaster.findMany({
        where: {
          Enable: 'Y',
          SecurityRole: 'USER',
          EmpNo: { notIn: punchedEmpNos.length > 0 ? punchedEmpNos : ['__NONE__'] },
        },
        select: {
          EmpNo: true,
          FirstName: true,
          LastName: true,
          Gender: true,
          PunchCardNo: true,
        },
        orderBy: { EmpNo: 'asc' },
      });

      return sendSuccess(res, 'Unpunched guards retrieved successfully', guards);
    } catch (error) {
      next(error);
    }
  }

  async simulatePunch(req, res, next) {
    try {
      const { empNo, empNos, genderFilter } = req.body;
      const today = getNormalizedToday();

      let targetEmpNos = [];

      if (Array.isArray(empNos) && empNos.length > 0) {
        targetEmpNos = empNos.map((id) => String(id));
      } else if (empNo) {
        targetEmpNos = [String(empNo)];
      }

      // If no explicit guards selected, pick from unpunched candidates
      if (targetEmpNos.length === 0) {
        const punchedRecords = await prisma.securityattendance.findMany({
          where: { PunchDate: today },
          select: { EmpNo: true },
        });
        const punchedEmpNos = punchedRecords.map((r) => r.EmpNo);

        const whereClause = {
          Enable: 'Y',
          SecurityRole: 'USER',
          EmpNo: { notIn: punchedEmpNos.length > 0 ? punchedEmpNos : ['__NONE__'] },
        };
        if (genderFilter) whereClause.Gender = genderFilter;

        const candidateGuards = await prisma.employeemaster.findMany({
          where: whereClause,
        });

        if (candidateGuards.length === 0) {
          return sendError(res, 'All guards have already punched in for today! Use Reset Simulation to re-test.', 400);
        }

        // Pick the first candidate guard by default
        targetEmpNos = [candidateGuards[0].EmpNo];
      }

      // Fetch candidate guards from DB
      const guards = await prisma.employeemaster.findMany({
        where: { EmpNo: { in: targetEmpNos } },
      });

      if (guards.length === 0) {
        return sendError(res, 'None of the specified guards were found.', 404);
      }

      const nowTimeStr = new Date().toTimeString().split(' ')[0];
      const dateStr = today.toISOString().split('T')[0];

      // Create Security Attendance Punch Records for all selected guards
      const createdPunches = [];
      for (const guard of guards) {
        // Check if guard already punched today to prevent duplicates
        const existing = await prisma.securityattendance.findFirst({
          where: { PunchDate: today, EmpNo: guard.EmpNo },
        });

        if (!existing) {
          const attendance = await prisma.securityattendance.create({
            data: {
              EmpNo: guard.EmpNo,
              PunchCardNo: guard.PunchCardNo || Number(guard.EmpNo),
              DeviceCode: 1,
              PunchDate: today,
              PunchTime: new Date(`1970-01-01T${nowTimeStr}Z`),
              PunchDateTime: new Date(`${dateStr}T${nowTimeStr}`),
              ShiftCode: 1,
              PunchType: 'IN',
              AttendanceStatus: 'PENDING',
              Remarks: 'Simulated Biometric Punch Reader #1',
            },
          });
          createdPunches.push({ attendance, guard });
        }
      }

      if (createdPunches.length === 0) {
        return sendError(res, 'Selected guard(s) have already punched in for today.', 400);
      }

      // Emit Real-time Socket.IO Events
      try {
        const io = getIO();
        for (const item of createdPunches) {
          io.emit('AttendanceReceived', {
            EmpNo: item.guard.EmpNo,
            GuardName: `${item.guard.FirstName} ${item.guard.LastName}`,
            Gender: item.guard.Gender,
            Time: nowTimeStr,
          });
        }
        io.emit('DashboardUpdated');
      } catch (err) {
        // Socket silent fallback
      }

      const namesList = createdPunches.map((p) => `${p.guard.FirstName} ${p.guard.LastName} (#${p.guard.EmpNo})`).join(', ');

      const successMsg = createdPunches.length === 1
        ? `Biometric IN Punch recorded for Guard #${createdPunches[0].guard.EmpNo} (${createdPunches[0].guard.FirstName} ${createdPunches[0].guard.LastName}). Status: PENDING allocation.`
        : `Biometric IN Punches recorded for ${createdPunches.length} Guards (${namesList}). Status: PENDING allocation.`;

      return sendSuccess(res, successMsg, {
        count: createdPunches.length,
        punches: createdPunches,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetTodaySimulation(req, res, next) {
    try {
      const today = getNormalizedToday();

      // Delete today's deployments, deployment history, and attendance records
      await prisma.$transaction([
        prisma.securityalertlog.deleteMany({
          where: {
            CreatedDateTime: { gte: today },
          },
        }),
        prisma.securitydeploymenthistory.deleteMany({
          where: {
            CreatedDateTime: { gte: today },
          },
        }),
        prisma.securitydeployment.deleteMany({
          where: { DeploymentDate: today },
        }),
        prisma.securityattendance.deleteMany({
          where: { PunchDate: today },
        }),
        prisma.securitypostvacancy.deleteMany({
          where: { VacancyDate: today },
        }),
      ]);

      // Re-populate initial vacancies for active posts
      const activePosts = await prisma.securitypostmaster.findMany({
        where: { Enable: 'Y' },
        include: { postCategory: true, location: true },
      });
      await allocationEngine.updateVacancyStatistics(today, 1, activePosts);

      // Emit Socket.IO Refresh
      try {
        const io = getIO();
        io.emit('DashboardUpdated');
      } catch (err) {
        // Socket silent fallback
      }

      return sendSuccess(res, "Today's attendance and guard allocations reset successfully to clean slate!");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SimulationController();
