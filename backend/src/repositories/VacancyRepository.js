const { prisma } = require('../config/prisma');

function getNormalizedDate(dateInput) {
  if (!dateInput) {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }
  const d = new Date(dateInput);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

class VacancyRepository {
  async findByDateAndShift(vacancyDate, shiftCode) {
    const targetDate = getNormalizedDate(vacancyDate);

    return await prisma.securitypostvacancy.findMany({
      where: {
        VacancyDate: targetDate,
        ShiftCode: Number(shiftCode),
      },
      include: {
        post: { include: { postCategory: true, location: true } },
        shift: true,
      },
      orderBy: { post: { Priority: 'asc' } },
    });
  }

  async upsertVacancy(vacancyDate, postCode, shiftCode, required, allocated, present) {
    const vacant = Math.max(0, required - allocated);
    let status = 'VACANT';
    if (allocated >= required && required > 0) {
      status = 'FULLY_ALLOCATED';
    } else if (allocated > 0) {
      status = 'PARTIALLY_ALLOCATED';
    }

    const dateObj = getNormalizedDate(vacancyDate);

    // Safe Find-then-Update or Create pattern for MySQL DATE compound keys
    const existing = await prisma.securitypostvacancy.findFirst({
      where: {
        VacancyDate: dateObj,
        PostCode: Number(postCode),
        ShiftCode: Number(shiftCode),
      },
    });

    if (existing) {
      return await prisma.securitypostvacancy.update({
        where: { VacancyCode: existing.VacancyCode },
        data: {
          RequiredGuards: required,
          AllocatedGuards: allocated,
          PresentGuards: present,
          VacantGuards: vacant,
          Status: status,
        },
      });
    } else {
      return await prisma.securitypostvacancy.create({
        data: {
          VacancyDate: dateObj,
          PostCode: Number(postCode),
          ShiftCode: Number(shiftCode),
          RequiredGuards: required,
          AllocatedGuards: allocated,
          PresentGuards: present,
          VacantGuards: vacant,
          Status: status,
        },
      });
    }
  }
}

module.exports = new VacancyRepository();
