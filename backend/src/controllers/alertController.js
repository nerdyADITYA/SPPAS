const alertService = require('../services/AlertService');
const { sendSuccess } = require('../utils/apiResponse');

class AlertController {
  async getAlerts(req, res, next) {
    try {
      const { page, pageSize, resolved, severity, alertType } = req.query;
      const result = await alertService.getAlerts({ page, pageSize, resolved, severity, alertType });
      return sendSuccess(res, 'Alert log retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async resolveAlert(req, res, next) {
    try {
      const { id } = req.params;
      const { remarks } = req.body;
      const resolvedBy = req.user.EmpNo;
      const result = await alertService.resolveAlert(id, resolvedBy, remarks);
      return sendSuccess(res, 'Alert marked as resolved', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AlertController();
