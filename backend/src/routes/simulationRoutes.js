const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/unpunched-guards', (req, res, next) => simulationController.getUnpunchedGuards(req, res, next));
router.post('/punch', (req, res, next) => simulationController.simulatePunch(req, res, next));
router.post('/reset', (req, res, next) => simulationController.resetTodaySimulation(req, res, next));

module.exports = router;
