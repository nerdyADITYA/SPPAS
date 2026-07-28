const reportRepository = require('../repositories/ReportRepository');

class ReportService {
  async getAttendanceReport(filters) {
    return await reportRepository.getAttendanceReport(filters);
  }

  async getDeploymentReport(filters) {
    return await reportRepository.getDeploymentReport(filters);
  }

  async getVacancyReport(filters) {
    return await reportRepository.getVacancyReport(filters);
  }
}

module.exports = new ReportService();
