const { prisma } = require('../config/prisma');

class PostRepository {
  async findAll({ enableOnly = false } = {}) {
    const where = enableOnly ? { Enable: 'Y' } : {};
    return await prisma.securitypostmaster.findMany({
      where,
      include: {
        postCategory: true,
        location: true,
      },
      orderBy: [{ CriticalPost: 'desc' }, { Priority: 'asc' }],
    });
  }

  async findById(postCode) {
    return await prisma.securitypostmaster.findUnique({
      where: { PostCode: Number(postCode) },
      include: {
        postCategory: true,
        location: true,
      },
    });
  }

  async create(data) {
    return await prisma.securitypostmaster.create({
      data,
    });
  }

  async update(postCode, data) {
    return await prisma.securitypostmaster.update({
      where: { PostCode: Number(postCode) },
      data: { ...data, UpdateDateTime: new Date() },
    });
  }

  async delete(postCode) {
    return await prisma.securitypostmaster.update({
      where: { PostCode: Number(postCode) },
      data: { Enable: 'N', UpdateDateTime: new Date() },
    });
  }
}

module.exports = new PostRepository();
