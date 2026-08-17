const { body } = require('express-validator');

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

const createShiftValidator = [
  body('Shift')
    .trim()
    .notEmpty()
    .withMessage('Shift name is required.')
    .isLength({ max: 25 })
    .withMessage('Shift name must be under 25 characters.'),
  body('Statutory')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 25 })
    .withMessage('Statutory name must be under 25 characters.'),
  body('ShiftStartTime')
    .optional({ checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Start Time must be a valid time in HH:MM format.'),
  body('ShiftEndTime')
    .optional({ checkFalsy: true })
    .matches(timeRegex)
    .withMessage('End Time must be a valid time in HH:MM format.'),
  body('FullDayHrs')
    .optional({ checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Full Day Hours must be a valid duration in HH:MM format.'),
  body('LunchHrs')
    .optional({ checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Lunch Hours must be a valid duration in HH:MM format.'),
  body('GraceAfterShiftStart')
    .optional({ checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Grace Start Time must be a valid time in HH:MM format.'),
  body('GraceBeforeShiftEnd')
    .optional({ checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Grace End Time must be a valid time in HH:MM format.'),
  body('ShiftAlocation_StartTime')
    .optional({ checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Allocation Start Time must be a valid time in HH:MM format.'),
  body('ShiftAlocation_EndTime')
    .optional({ checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Allocation End Time must be a valid time in HH:MM format.'),
  body('Enable')
    .optional()
    .isIn(['Y', 'N'])
    .withMessage('Enable status must be Y or N.'),
];

const updateShiftValidator = [
  body('Shift')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Shift name cannot be empty.')
    .isLength({ max: 25 })
    .withMessage('Shift name must be under 25 characters.'),
  body('Statutory')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 25 })
    .withMessage('Statutory name must be under 25 characters.'),
  body('ShiftStartTime')
    .optional({ nullable: true, checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Start Time must be a valid time in HH:MM format.'),
  body('ShiftEndTime')
    .optional({ nullable: true, checkFalsy: true })
    .matches(timeRegex)
    .withMessage('End Time must be a valid time in HH:MM format.'),
  body('FullDayHrs')
    .optional({ nullable: true, checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Full Day Hours must be a valid duration in HH:MM format.'),
  body('LunchHrs')
    .optional({ nullable: true, checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Lunch Hours must be a valid duration in HH:MM format.'),
  body('GraceAfterShiftStart')
    .optional({ nullable: true, checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Grace Start Time must be a valid time in HH:MM format.'),
  body('GraceBeforeShiftEnd')
    .optional({ nullable: true, checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Grace End Time must be a valid time in HH:MM format.'),
  body('ShiftAlocation_StartTime')
    .optional({ nullable: true, checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Allocation Start Time must be a valid time in HH:MM format.'),
  body('ShiftAlocation_EndTime')
    .optional({ nullable: true, checkFalsy: true })
    .matches(timeRegex)
    .withMessage('Allocation End Time must be a valid time in HH:MM format.'),
  body('Enable')
    .optional()
    .isIn(['Y', 'N'])
    .withMessage('Enable status must be Y or N.'),
];

module.exports = {
  createShiftValidator,
  updateShiftValidator,
};
