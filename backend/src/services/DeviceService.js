const deviceRepository = require('../repositories/DeviceRepository');

class DeviceService {
  async getDevices() {
    return await deviceRepository.findAll();
  }

  async getDeviceById(id) {
    const dev = await deviceRepository.findById(id);
    if (!dev) throw new Error('Device not found');
    return dev;
  }

  async createDevice(data) {
    return await deviceRepository.create(data);
  }

  async updateDevice(id, data) {
    return await deviceRepository.update(id, data);
  }

  async updateHeartbeat(deviceCode, status = 'ONLINE') {
    return await deviceRepository.updateHeartbeat(deviceCode, status);
  }

  async deleteDevice(id) {
    return await deviceRepository.delete(id);
  }
}

module.exports = new DeviceService();
