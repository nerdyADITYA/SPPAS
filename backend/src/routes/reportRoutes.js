const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

const allowedRoles = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.SUPERVISOR, ROLES.CONTROLROOM];

router.get('/attendance', authenticate, authorize(allowedRoles), reportController.getAttendanceReport);
router.get('/deployments', authenticate, authorize(allowedRoles), reportController.getDeploymentReport);
router.get('/deployment', authenticate, authorize(allowedRoles), reportController.getDeploymentReport);
router.get('/vacancies', authenticate, authorize(allowedRoles), reportController.getVacancyReport);
router.get('/vacancy', authenticate, authorize(allowedRoles), reportController.getVacancyReport);

module.exports = router;
