const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, alertController.getAlerts);
router.patch('/:id/resolve', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.SUPERVISOR]), alertController.resolveAlert);

module.exports = router;
