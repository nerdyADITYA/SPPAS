const { logger } = require('../config/logger');
const { sendError } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  logger.error('Unhandled API Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An internal server error occurred.' 
    : err.message || 'Internal Server Error';

  return sendError(res, message, [], statusCode);
}

module.exports = { errorHandler };
