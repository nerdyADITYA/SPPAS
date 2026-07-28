const express = require('express');
const router = express.Router();
const allocationRuleController = require('../controllers/allocationRuleController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants/roles');

router.get('/', authenticate, allocationRuleController.getRules);
router.post('/', authenticate, authorize([ROLES.SUPERADMIN]), allocationRuleController.createRule);
router.put('/:id', authenticate, authorize([ROLES.SUPERADMIN]), allocationRuleController.updateRule);

module.exports = router;
