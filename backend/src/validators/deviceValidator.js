const { body } = require('express-validator');

const createDeviceValidator = [
  body('DeviceName').trim().notEmpty().withMessage('Device name is required.'),
  body('IPAddress').isIP().withMessage('Valid IP address is required.'),
  body('PortNo').optional().isInt({ min: 1, max: 65535 }).withMessage('Port must be between 1 and 65535.'),
];

module.exports = { createDeviceValidator };
