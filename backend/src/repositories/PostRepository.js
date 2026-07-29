const { prisma } = require('../config/prisma');

class PostRepository {
  async syncCriticalFlags() {
    try {
      await prisma.securitypostmaster.updateMany({
        where: { Priority: 1 },
        data: { CriticalPost: 'Y' },
      });
      await prisma.securitypostmaster.updateMany({
        where: { Priority: { gt: 1 } },
        data: { CriticalPost: 'N' },
      });
    } catch (err) {
      console.error('Error syncing critical post flags:', err.message);
    }
  }

  async findAll({ enableOnly = false } = {}) {
    await this.syncCriticalFlags();
    const where = enableOnly ? { Enable: 'Y' } : {};
    return await prisma.securitypostmaster.findMany({
      where,
      include: {
        postCategory: true,
        location: true,
      },
      orderBy: [{ Priority: 'asc' }, { PostCode: 'asc' }],
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
    const priority = Number(data.Priority || 1);
    const criticalPost = priority === 1 ? 'Y' : 'N';
    return await prisma.securitypostmaster.create({
      data: {
        ...data,
        Priority: priority,
        CriticalPost: criticalPost,
      },
    });
  }

  async update(postCode, data) {
    const updateData = { ...data, UpdateDateTime: new Date() };
    if (data.Priority !== undefined) {
      const priority = Number(data.Priority);
      updateData.Priority = priority;
      updateData.CriticalPost = priority === 1 ? 'Y' : 'N';
    }
    return await prisma.securitypostmaster.update({
      where: { PostCode: Number(postCode) },
      data: updateData,
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
