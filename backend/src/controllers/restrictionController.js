const restrictionService = require('../services/RestrictionService');
const { sendSuccess } = require('../utils/apiResponse');

class RestrictionController {
  async getRestrictions(req, res, next) {
    try {
      const restrictions = await restrictionService.getRestrictions();
      return sendSuccess(res, 'Guard restrictions retrieved successfully', restrictions);
    } catch (error) {
      next(error);
    }
  }

  async createRestriction(req, res, next) {
    try {
      const restriction = await restrictionService.createRestriction(req.body);
      return sendSuccess(res, 'Guard restriction created successfully', restriction, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateRestriction(req, res, next) {
    try {
      const { id } = req.params;
      const restriction = await restrictionService.updateRestriction(id, req.body);
      return sendSuccess(res, 'Guard restriction updated successfully', restriction);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RestrictionController();
