const { prisma } = require('../config/prisma');
const vacancyService = require('../services/VacancyService');
const alertService = require('../services/AlertService');
const allocationEngine = require('../allocation/AllocationEngine');
const { sendSuccess } = require('../utils/apiResponse');

function getNormalizedToday() {
  const now = new Date();
  const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return new Date(dateFormatted);
}

class DashboardController {
  async getStatistics(req, res, next) {
    try {
      const today = getNormalizedToday();

      const [totalEmployees, presentAttendance, totalDeployments, activeAlerts, devices] = await Promise.all([
        prisma.employeemaster.count({ where: { Enable: 'Y' } }),
        prisma.securityattendance.count({ where: { PunchDate: today } }),
        prisma.securitydeployment.count({
          where: {
            DeploymentDate: today,
            DeploymentStatus: { in: ['ALLOCATED', 'REPORTED', 'COMPLETED'] },
          },
        }),
        prisma.securityalertlog.count({ where: { Resolved: 'N' } }),
        prisma.securitydevicemaster.findMany(),
      ]);

      const onlineDevices = devices.filter((d) => d.DeviceStatus === 'ONLINE').length;
      const offlineDevices = devices.filter((d) => d.DeviceStatus === 'OFFLINE').length;

      return sendSuccess(res, 'Dashboard statistics retrieved successfully', {
        totalGuardsPresent: presentAttendance,
        guardsAllocated: totalDeployments,
        totalRegisteredEmployees: totalEmployees,
        activeAlertsCount: activeAlerts,
        devicesStatus: {
          total: devices.length,
          online: onlineDevices,
          offline: offlineDevices,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getVacancies(req, res, next) {
    try {
      const { date, shiftCode } = req.query;
      const targetShift = shiftCode ? Number(shiftCode) : 1;
      let vacancies = await vacancyService.getVacancies(date, targetShift);

      // If no vacancy records exist for this shift yet, calculate & populate from active posts
      if (!vacancies || vacancies.length === 0) {
        const activePosts = await prisma.securitypostmaster.findMany({
          where: { Enable: 'Y' },
          include: { postCategory: true, location: true },
        });
        if (activePosts.length > 0) {
          const targetDate = date ? new Date(date) : getNormalizedToday();
          await allocationEngine.updateVacancyStatistics(targetDate, targetShift, activePosts);
          vacancies = await vacancyService.getVacancies(date, targetShift);
        }
      }

      return sendSuccess(res, 'Dashboard vacancies retrieved successfully', vacancies);
    } catch (error) {
      next(error);
    }
  }

  async getRecentAlerts(req, res, next) {
    try {
      const result = await alertService.getAlerts({ page: 1, pageSize: 10, resolved: 'N' });
      return sendSuccess(res, 'Recent active alerts retrieved successfully', result.data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
