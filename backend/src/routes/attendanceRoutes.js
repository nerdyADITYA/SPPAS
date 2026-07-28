const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { importAttendanceValidator } = require('../validators/attendanceValidator');
const { validate } = require('../middleware/validationMiddleware');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, attendanceController.getAttendance);
router.post('/', importAttendanceValidator, validate, attendanceController.importAttendance); // Attendance import used by Python service

module.exports = router;
