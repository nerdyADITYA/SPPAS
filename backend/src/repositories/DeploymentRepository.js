const { prisma } = require('../config/prisma');
const emailService = require('../services/emailService');

class DeploymentRepository {
  async findAll({ page = 1, pageSize = 25, date, shiftCode, postCode, status }) {
    const skip = (page - 1) * pageSize;
    const where = {};

    if (date) where.DeploymentDate = new Date(date);
    if (shiftCode) where.ShiftCode = Number(shiftCode);
    if (postCode) where.PostCode = Number(postCode);
    if (status) where.DeploymentStatus = status;

    const [data, totalRecords] = await Promise.all([
      prisma.securitydeployment.findMany({
        where,
        skip,
        take: Number(pageSize),
        include: {
          employee: true,
          post: { include: { postCategory: true, location: true } },
          shift: true,
          allocatedUser: true,
          approvedUser: true,
        },
        orderBy: { CreatedDateTime: 'desc' },
      }),
      prisma.securitydeployment.count({ where }),
    ]);

    return {
      data,
      page: Number(page),
      pageSize: Number(pageSize),
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    };
  }

  async findById(deploymentCode) {
    return await prisma.securitydeployment.findUnique({
      where: { DeploymentCode: BigInt(deploymentCode) },
      include: {
        employee: true,
        post: { include: { postCategory: true, location: true } },
        shift: true,
        allocatedUser: true,
        approvedUser: true,
        historyRecords: {
          include: { changedUser: true },
          orderBy: { CreatedDateTime: 'desc' },
        },
      },
    });
  }

  async findExistingDeployment(deploymentDate, empNo, shiftCode) {
    return await prisma.securitydeployment.findUnique({
      where: {
        uk_Deployment: {
          DeploymentDate: new Date(deploymentDate),
          EmpNo: empNo,
          ShiftCode: Number(shiftCode),
        },
      },
    });
  }

  async createDeployment(data, historyData) {
    const result = await prisma.$transaction(async (tx) => {
      const deployment = await tx.securitydeployment.create({
        data,
        include: { post: { include: { postCategory: true, location: true } } },
      });
      
      await tx.securitydeploymenthistory.create({
        data: {
          DeploymentCode: deployment.DeploymentCode,
          EmpNo: deployment.EmpNo,
          PostCode: deployment.PostCode,
          ShiftCode: deployment.ShiftCode,
          DeploymentStatus: deployment.DeploymentStatus,
          ActionType: historyData.ActionType || 'CREATED',
          ChangedBy: historyData.ChangedBy,
          Remarks: historyData.Remarks || 'Deployment created',
        },
      });

      return deployment;
    });

    // Trigger Automated Email Dispatch to Guard
    emailService.sendGuardDeploymentEmail({
      empNo: result.EmpNo,
      deploymentDate: result.DeploymentDate,
      shiftName: `Shift ${result.ShiftCode}`,
      postName: result.post?.PostName || `Post #${result.PostCode}`,
      categoryName: result.post?.postCategory?.PostCategoryName || 'Security Duty Post',
      locationName: result.post?.location?.Location || 'Campus Sector',
      isCritical: result.post?.CriticalPost === 'Y',
      remarks: historyData.Remarks || 'Manually deployed by Supervisor',
    });

    return result;
  }

  async updateDeployment(deploymentCode, updateData, historyData) {
    return await prisma.$transaction(async (tx) => {
      const updated = await tx.securitydeployment.update({
        where: { DeploymentCode: BigInt(deploymentCode) },
        data: { ...updateData, UpdateDateTime: new Date() },
      });

      await tx.securitydeploymenthistory.create({
        data: {
          DeploymentCode: updated.DeploymentCode,
          EmpNo: updated.EmpNo,
          PostCode: updated.PostCode,
          ShiftCode: updated.ShiftCode,
          DeploymentStatus: updated.DeploymentStatus,
          ActionType: historyData.ActionType || 'UPDATED',
          ChangedBy: historyData.ChangedBy,
          Remarks: historyData.Remarks || 'Deployment updated',
        },
      });

      return updated;
    });
  }
}

module.exports = new DeploymentRepository();
