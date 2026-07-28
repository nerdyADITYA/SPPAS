const express = require('express');
const router = express.Router();
const restrictionController = require('../controllers/restrictionController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, restrictionController.getRestrictions);
router.post('/', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), restrictionController.createRestriction);
router.put('/:id', authenticate, authorize([ROLES.SUPERADMIN, ROLES.ADMIN]), restrictionController.updateRestriction);

module.exports = router;
