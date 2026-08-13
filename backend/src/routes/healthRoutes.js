const express = require('express');
const router = express.Router();
const { prisma } = require('../config/prisma');
const { sendSuccess, sendError } = require('../utils/apiResponse');

router.get('/', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return sendSuccess(res, 'Health check passed', {
      status: 'ONLINE',
      database: 'CONNECTED',
      serverTime: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    return sendError(
      res,
      'Health check failed',
      [{ status: 'DEGRADED', database: 'DISCONNECTED', error: error.message }],
      500
    );
  }
});

router.get('/sync-status', async (req, res) => {
  try {
    const [latestAttendance, latestDeployment, onlineDevicesCount, totalDevicesCount, activeDeploymentsCount] = await Promise.all([
      prisma.securityattendance.findFirst({
        orderBy: { AttendanceCode: 'desc' },
        select: { PunchDateTime: true, CreatedDateTime: true },
      }),
      prisma.securitydeployment.findFirst({
        orderBy: { DeploymentCode: 'desc' },
        select: { DeploymentDate: true, CreatedDateTime: true },
      }),
      prisma.securitydevicemaster.count({
        where: { DeviceStatus: 'ONLINE', Enable: 'Y' },
      }),
      prisma.securitydevicemaster.count({
        where: { Enable: 'Y' },
      }),
      prisma.securitydeployment.count({
        where: { DeploymentStatus: { in: ['ALLOCATED', 'REPORTED'] } },
      }),
    ]);

    const lastAttendanceTime = latestAttendance ? (latestAttendance.CreatedDateTime || latestAttendance.PunchDateTime) : null;
    const lastDeploymentTime = latestDeployment ? (latestDeployment.CreatedDateTime || latestDeployment.DeploymentDate) : null;

    return sendSuccess(res, 'System sync status retrieved', {
      status: 'ONLINE',
      database: 'CONNECTED',
      serverTime: new Date().toISOString(),
      lastAttendanceTime,
      lastDeploymentTime,
      onlineDevicesCount,
      totalDevicesCount,
      activeDeploymentsCount,
    });
  } catch (error) {
    return sendError(res, 'Failed to fetch sync status', [error.message], 500);
  }
});

module.exports = router;
