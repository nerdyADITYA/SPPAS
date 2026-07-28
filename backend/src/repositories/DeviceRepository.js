const { prisma } = require('../config/prisma');

class DeviceRepository {
  async findAll() {
    return await prisma.securitydevicemaster.findMany({
      include: { location: true },
      orderBy: { DeviceCode: 'asc' },
    });
  }

  async findById(deviceCode) {
    return await prisma.securitydevicemaster.findUnique({
      where: { DeviceCode: Number(deviceCode) },
      include: { location: true },
    });
  }

  async findByIp(ipAddress) {
    return await prisma.securitydevicemaster.findUnique({
      where: { IPAddress: ipAddress },
    });
  }

  async create(data) {
    return await prisma.securitydevicemaster.create({ data });
  }

  async update(deviceCode, data) {
    return await prisma.securitydevicemaster.update({
      where: { DeviceCode: Number(deviceCode) },
      data: { ...data, UpdateDateTime: new Date() },
    });
  }

  async updateHeartbeat(deviceCode, status = 'ONLINE') {
    return await prisma.securitydevicemaster.update({
      where: { DeviceCode: Number(deviceCode) },
      data: {
        DeviceStatus: status,
        LastHeartbeat: new Date(),
        LastSyncDateTime: new Date(),
      },
    });
  }

  async delete(deviceCode) {
    return await prisma.securitydevicemaster.update({
      where: { DeviceCode: Number(deviceCode) },
      data: { Enable: 'N', UpdateDateTime: new Date() },
    });
  }
}

module.exports = new DeviceRepository();
