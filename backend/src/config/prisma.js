const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger');

// BigInt JSON serialization patch for standard JSON.stringify
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('error', (e) => {
  logger.error('Prisma Error:', e);
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning:', e);
});

module.exports = { prisma };
