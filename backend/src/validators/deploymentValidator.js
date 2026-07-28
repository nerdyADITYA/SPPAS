const { body } = require('express-validator');

const manualDeploymentValidator = [
  body('deploymentDate').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('deploymentDate must be in YYYY-MM-DD format.'),
  body('empNo').trim().notEmpty().withMessage('empNo is required.'),
  body('postCode').isInt().withMessage('postCode must be an integer.'),
  body('shiftCode').isInt().withMessage('shiftCode must be an integer.'),
];

module.exports = { manualDeploymentValidator };
