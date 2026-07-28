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

module.exports = router;
