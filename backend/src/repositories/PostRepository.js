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
    const { postCategory, location, PostCode, CreatedDateTime, ...validFields } = data;
    const updateData = {
      UpdateDateTime: new Date(),
    };

    if (validFields.PostName !== undefined) updateData.PostName = validFields.PostName;
    if (validFields.PostShortName !== undefined) updateData.PostShortName = validFields.PostShortName;
    if (validFields.PostCategoryCode !== undefined) updateData.PostCategoryCode = Number(validFields.PostCategoryCode);
    if (validFields.MinimumGuards !== undefined) updateData.MinimumGuards = Number(validFields.MinimumGuards);
    if (validFields.MaximumGuards !== undefined) updateData.MaximumGuards = Number(validFields.MaximumGuards);
    if (validFields.FemaleOnly !== undefined) updateData.FemaleOnly = validFields.FemaleOnly;
    if (validFields.Enable !== undefined) updateData.Enable = validFields.Enable;

    if (validFields.Priority !== undefined) {
      const priority = Number(validFields.Priority);
      updateData.Priority = priority;
      updateData.CriticalPost = priority === 1 ? 'Y' : 'N';
    }

    return await prisma.securitypostmaster.update({
      where: { PostCode: Number(postCode) },
      data: updateData,
    });
  }

  async delete(postCode) {
    const code = Number(postCode);
    try {
      await prisma.securityalertlog.deleteMany({ where: { PostCode: code } });
      await prisma.securitypostvacancy.deleteMany({ where: { PostCode: code } });
      await prisma.securitydeploymenthistory.deleteMany({ where: { PostCode: code } });
      await prisma.securitydeployment.deleteMany({ where: { PostCode: code } });

      return await prisma.securitypostmaster.delete({
        where: { PostCode: code },
      });
    } catch (err) {
      console.warn(`Hard delete error for PostCode ${code}: ${err.message}. Performing soft-delete (Enable='N')`);
      return await prisma.securitypostmaster.update({
        where: { PostCode: code },
        data: { Enable: 'N', UpdateDateTime: new Date() },
      });
    }
  }
}

module.exports = new PostRepository();
