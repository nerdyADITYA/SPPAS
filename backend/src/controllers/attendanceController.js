const attendanceService = require('../services/AttendanceService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

class AttendanceController {
  async getAttendance(req, res, next) {
    try {
      const { page, pageSize, empNo, date, status } = req.query;
      const result = await attendanceService.getAttendanceList({ page, pageSize, empNo, date, status });
      return sendSuccess(res, 'Attendance logs retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async importAttendance(req, res, next) {
    try {
      const result = await attendanceService.importAttendance(req.body);
      return sendSuccess(res, 'Attendance imported & allocation triggered successfully', result, 201);
    } catch (error) {
      return sendError(res, error.message, [], 400);
    }
  }
}

module.exports = new AttendanceController();
