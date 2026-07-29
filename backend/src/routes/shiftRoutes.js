const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shiftController');
const { authenticate, authorize, checkModuleAccess } = require('../middleware/authMiddleware');
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

module.exports = router;
