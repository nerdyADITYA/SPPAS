const deviceService = require('../services/DeviceService');
const { sendSuccess } = require('../utils/apiResponse');

class DeviceController {
  async getDevices(req, res, next) {
    try {
      const devices = await deviceService.getDevices();
      return sendSuccess(res, 'Biometric devices retrieved successfully', devices);
    } catch (error) {
      next(error);
    }
  }

  async getDeviceById(req, res, next) {
    try {
      const { id } = req.params;
      const device = await deviceService.getDeviceById(id);
      return sendSuccess(res, 'Biometric device retrieved successfully', device);
    } catch (error) {
      next(error);
    }
  }

  async createDevice(req, res, next) {
    try {
      const device = await deviceService.createDevice(req.body);
      return sendSuccess(res, 'Biometric device registered successfully', device, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateDevice(req, res, next) {
    try {
      const { id } = req.params;
      const device = await deviceService.updateDevice(id, req.body);
      return sendSuccess(res, 'Biometric device updated successfully', device);
    } catch (error) {
      next(error);
    }
  }

  async heartbeat(req, res, next) {
    try {
      const { deviceCode, status } = req.body;
      const updated = await deviceService.updateHeartbeat(deviceCode, status);
      return sendSuccess(res, 'Heartbeat recorded successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteDevice(req, res, next) {
    try {
      const { id } = req.params;
      await deviceService.deleteDevice(id);
      return sendSuccess(res, 'Biometric device disabled successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeviceController();
