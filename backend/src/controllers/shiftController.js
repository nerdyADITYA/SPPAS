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
}

module.exports = new ShiftController();
