const alertRepository = require('../repositories/AlertRepository');

class AlertService {
  async getAlerts(params) {
    return await alertRepository.findAll(params);
  }

  async createAlert(data) {
    return await alertRepository.create(data);
  }

  async resolveAlert(alertCode, resolvedBy, remarks) {
    return await alertRepository.resolve(alertCode, resolvedBy, remarks);
  }
}

module.exports = new AlertService();
