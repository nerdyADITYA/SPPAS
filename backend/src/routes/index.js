const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');
const postCategoryRoutes = require('./postCategoryRoutes');
const postRoutes = require('./postRoutes');
const allocationRuleRoutes = require('./allocationRuleRoutes');
const restrictionRoutes = require('./restrictionRoutes');
const deviceRoutes = require('./deviceRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const deploymentRoutes = require('./deploymentRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const alertRoutes = require('./alertRoutes');
const reportRoutes = require('./reportRoutes');
const simulationRoutes = require('./simulationRoutes');
const healthRoutes = require('./healthRoutes');
const shiftRoutes = require('./shiftRoutes');
const accessRightsRoutes = require('./accessRightsRoutes');

router.use('/auth', authRoutes);
router.use('/login', authRoutes); // Map /login directly for convenience
router.use('/employees', employeeRoutes);
router.use('/post-categories', postCategoryRoutes);
router.use('/posts', postRoutes);
router.use('/allocation-rules', allocationRuleRoutes);
router.use('/restrictions', restrictionRoutes);
router.use('/devices', deviceRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/deployments', deploymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/alerts', alertRoutes);
router.use('/reports', reportRoutes);
router.use('/simulation', simulationRoutes);
router.use('/health', healthRoutes);
router.use('/shifts', shiftRoutes);
router.use('/access-rights', accessRightsRoutes);

module.exports = router;
