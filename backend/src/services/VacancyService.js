const vacancyRepository = require('../repositories/VacancyRepository');

class VacancyService {
  async getVacancies(date, shiftCode) {
    const targetDate = date ? new Date(date) : new Date();
    return await vacancyRepository.findByDateAndShift(targetDate, shiftCode || 1);
  }
}

module.exports = new VacancyService();
