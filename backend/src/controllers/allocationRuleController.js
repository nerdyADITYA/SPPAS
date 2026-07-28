const allocationRuleService = require('../services/AllocationRuleService');
const { sendSuccess } = require('../utils/apiResponse');

class AllocationRuleController {
  async getRules(req, res, next) {
    try {
      const rules = await allocationRuleService.getRules();
      return sendSuccess(res, 'Allocation rules retrieved successfully', rules);
    } catch (error) {
      next(error);
    }
  }

  async createRule(req, res, next) {
    try {
      const rule = await allocationRuleService.createRule(req.body);
      return sendSuccess(res, 'Allocation rule created successfully', rule, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateRule(req, res, next) {
    try {
      const { id } = req.params;
      const rule = await allocationRuleService.updateRule(id, req.body);
      return sendSuccess(res, 'Allocation rule updated successfully', rule);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AllocationRuleController();
