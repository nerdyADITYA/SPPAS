const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const { authenticate, authorize, checkModuleAccess } = require('../middleware/authMiddleware');
const { createShiftValidator, updateShiftValidator } = require('../validators/shiftValidator');
const { validate } = require('../middleware/validationMiddleware');
const { ROLES } = require('../constants/roles');

router.get(
  '/',
  authenticate,
  checkModuleAccess('shifts', 'READ'),
  shiftController.getShifts
);

router.get(
  '/:shiftCode',
  authenticate,
  checkModuleAccess('shifts', 'READ'),
  shiftController.getShiftByCode
);

router.post(
  '/',
  authenticate,
  checkModuleAccess('shifts', 'MUTATE'),
  createShiftValidator,
  validate,
  shiftController.createShift
);

router.put(
  '/:shiftCode',
  authenticate,
  checkModuleAccess('shifts', 'MUTATE'),
  updateShiftValidator,
  validate,
  shiftController.updateShift
);

module.exports = router;
