const { body } = require('express-validator');

const loginValidator = [
  body('empNo')
    .trim()
    .notEmpty()
    .withMessage('Employee number is required.'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.'),
];

module.exports = { loginValidator };
