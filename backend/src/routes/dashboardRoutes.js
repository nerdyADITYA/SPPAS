const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/summary', authenticate, dashboardController.getStatistics);
router.get('/statistics', authenticate, dashboardController.getStatistics);
router.get('/vacancies', authenticate, dashboardController.getVacancies);
router.get('/alerts', authenticate, dashboardController.getRecentAlerts);

module.exports = router;
