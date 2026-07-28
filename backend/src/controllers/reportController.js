const reportService = require('../services/ReportService');
const { sendSuccess } = require('../utils/apiResponse');

class ReportController {
  async getAttendanceReport(req, res, next) {
    try {
      const { startDate, endDate, empNo, shiftCode } = req.query;
      const data = await reportService.getAttendanceReport({ startDate, endDate, empNo, shiftCode });
      return sendSuccess(res, 'Attendance report data generated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getDeploymentReport(req, res, next) {
    try {
      const { startDate, endDate, empNo, postCode, shiftCode, status } = req.query;
      const data = await reportService.getDeploymentReport({ startDate, endDate, empNo, postCode, shiftCode, status });
      return sendSuccess(res, 'Deployment report data generated successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async getVacancyReport(req, res, next) {
    try {
      const { startDate, endDate, shiftCode } = req.query;
      const data = await reportService.getVacancyReport({ startDate, endDate, shiftCode });
      return sendSuccess(res, 'Vacancy report data generated successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
