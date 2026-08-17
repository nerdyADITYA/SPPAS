const shiftService = require('../services/ShiftService');
const { sendSuccess } = require('../utils/apiResponse');

class ShiftController {
  async getShifts(req, res, next) {
    try {
      const shifts = await shiftService.getAllShifts();
      return sendSuccess(res, 'Shift Master records retrieved successfully', shifts);
    } catch (error) {
      next(error);
    }
  }

  async getShiftByCode(req, res, next) {
    try {
      const { shiftCode } = req.params;
      const shift = await shiftService.getShiftById(shiftCode);
      return sendSuccess(res, 'Shift record retrieved successfully', shift);
    } catch (error) {
      next(error);
    }
  }

  async createShift(req, res, next) {
    try {
      const shift = await shiftService.createShift(req.body);
      return sendSuccess(res, 'Shift record created successfully', shift, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateShift(req, res, next) {
    try {
      const { shiftCode } = req.params;
      const shift = await shiftService.updateShift(shiftCode, req.body);
      return sendSuccess(res, 'Shift record updated successfully', shift);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShiftController();
