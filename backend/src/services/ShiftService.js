const shiftRepository = require('../repositories/ShiftRepository');

class ShiftService {
  async getAllShifts() {
    return await shiftRepository.findAll();
  }

  async getShiftById(shiftCode) {
    const shift = await shiftRepository.findById(shiftCode);
    if (!shift) {
      const error = new Error(`Shift with code ${shiftCode} not found`);
      error.statusCode = 404;
      throw error;
    }
    return shift;
  }
}

module.exports = new ShiftService();
