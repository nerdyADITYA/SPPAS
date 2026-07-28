const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');
const { MESSAGES } = require('../constants/messages');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.param || err.path,
      message: err.msg,
    }));
    return sendError(res, MESSAGES.VALIDATION_ERROR, formattedErrors, 400);
  }
  next();
}

module.exports = { validate };
