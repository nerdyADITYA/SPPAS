const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { importAttendanceValidator } = require('../validators/attendanceValidator');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
const { sendSuccess } = require('../utils/apiResponse');

router.get('/all', async (req, res, next) => {
  try {
    const attendanceService = require('../services/AttendanceService');
    const list = await attendanceService.getAttendanceList({ pageSize: 1000 });
    return sendSuccess(res, 'All attendance logs retrieved', list);
  } catch (error) {
    next(error);
  }
});
router.get('/', authenticate, attendanceController.getAttendance);
router.post('/', importAttendanceValidator, validate, attendanceController.importAttendance); // Attendance import used by Python service

module.exports = router;
