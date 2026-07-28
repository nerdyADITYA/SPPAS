const { body } = require('express-validator');

const importAttendanceValidator = [
  body('empNo').trim().notEmpty().withMessage('Employee number (empNo) is required.'),
  body('punchDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('punchDate must be in YYYY-MM-DD format.'),
  body('punchTime').matches(/^\d{2}:\d{2}:\d{2}$/).withMessage('punchTime must be in HH:mm:ss format.'),
  body('deviceCode').isInt().withMessage('deviceCode must be an integer.'),
];

module.exports = { importAttendanceValidator };
