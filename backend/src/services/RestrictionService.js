const restrictionRepository = require('../repositories/RestrictionRepository');

class RestrictionService {
  async getRestrictions() {
    return await restrictionRepository.findAll();
  }

  async createRestriction(data) {
    return await restrictionRepository.create(data);
  }

  async updateRestriction(id, data) {
    return await restrictionRepository.update(id, data);
  }
}

module.exports = new RestrictionService();
