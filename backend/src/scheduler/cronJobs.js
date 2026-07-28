const cron = require('node-cron');
const { prisma } = require('../config/prisma');
const { logger } = require('../config/logger');

function initCronJobs() {
  // Device Health Monitor: Check heartbeat every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const timeoutThreshold = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes timeout
      
      const offlineDevices = await prisma.securitydevicemaster.updateMany({
        where: {
          Enable: 'Y',
          DeviceStatus: 'ONLINE',
          OR: [
            { LastHeartbeat: { lt: timeoutThreshold } },
            { LastHeartbeat: null },
          ],
        },
        data: { DeviceStatus: 'OFFLINE' },
      });

      if (offlineDevices.count > 0) {
        logger.warn(`Device Monitor Cron: Marked ${offlineDevices.count} device(s) OFFLINE due to heartbeat timeout.`);
      }
    } catch (error) {
      logger.error('Cron job device monitor error:', error);
    }
  });

  logger.info('Node-Cron Background Jobs initialized.');
}

module.exports = { initCronJobs };
