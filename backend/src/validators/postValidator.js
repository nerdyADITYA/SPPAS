const { body } = require('express-validator');

const createPostValidator = [
  body('PostName')
    .trim()
    .notEmpty()
    .withMessage('Post name is required.'),
  body('PostCategoryCode')
    .notEmpty()
    .isInt()
    .withMessage('Valid post category code is required.'),
  body('MinimumGuards')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Minimum guards must be at least 1.'),
  body('MaximumGuards')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum guards must be at least 1.'),
];

module.exports = { createPostValidator };
