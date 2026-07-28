const http = require('http');
const app = require('./app');
const { config } = require('./config/env');
const { logger } = require('./config/logger');
const { initSocketServer } = require('./websocket/socketServer');
const { initCronJobs } = require('./scheduler/cronJobs');

const server = http.createServer(app);

// Initialize Socket.IO
initSocketServer(server, config.corsOrigin);

// Initialize Background Cron Jobs
initCronJobs();

server.listen(config.port, () => {
  logger.info(`=======================================================`);
  logger.info(`SPPAS Backend Service running on port: ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`API Base URL: http://localhost:${config.port}/api/v1`);
  logger.info(`=======================================================`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});
