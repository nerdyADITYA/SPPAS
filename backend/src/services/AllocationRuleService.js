const allocationRuleRepository = require('../repositories/AllocationRuleRepository');

class AllocationRuleService {
  async getRules() {
    return await allocationRuleRepository.findAll();
  }

  async createRule(data) {
    return await allocationRuleRepository.create(data);
  }

  async updateRule(id, data) {
    return await allocationRuleRepository.update(id, data);
  }
}

module.exports = new AllocationRuleService();
