const { prisma } = require('../config/prisma');

class PostCategoryRepository {
  async findAll() {
    return await prisma.securitypostcategorymaster.findMany({
      orderBy: { PostCategoryCode: 'asc' },
    });
  }

  async findById(postCategoryCode) {
    return await prisma.securitypostcategorymaster.findUnique({
      where: { PostCategoryCode: Number(postCategoryCode) },
    });
  }

  async create(data) {
    return await prisma.securitypostcategorymaster.create({
      data,
    });
  }

  async update(postCategoryCode, data) {
    return await prisma.securitypostcategorymaster.update({
      where: { PostCategoryCode: Number(postCategoryCode) },
      data: { ...data, UpdateDateTime: new Date() },
    });
  }

  async delete(postCategoryCode) {
    return await prisma.securitypostcategorymaster.update({
      where: { PostCategoryCode: Number(postCategoryCode) },
      data: { Enable: 'N', UpdateDateTime: new Date() },
    });
  }
}

module.exports = new PostCategoryRepository();
