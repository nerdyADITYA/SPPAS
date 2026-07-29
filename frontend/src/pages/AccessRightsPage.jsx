import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useSnackbar } from 'notistack';
import { useGuide } from '../contexts/GuideContext';
import { useAccessRights } from '../contexts/AccessRightsContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Alert,
  AlertTitle,
  Chip,
  Paper,
} from '@mui/material';
import {
  AdminPanelSettings as AccessIcon,
  Save as SaveIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as ActiveIcon,
  Block as DisabledIcon,
  Visibility as ViewOnlyIcon,
  Edit as FullAccessIcon,
} from '@mui/icons-material';

const MODULE_DEFINITIONS = [
  { key: 'dashboard', label: 'Dashboard', desc: 'Main real-time overview dashboard and high-level KPIs' },
  { key: 'attendance', label: 'Attendance Log', desc: 'Biometric punch records and live attendance streams' },
  { key: 'deployment', label: 'Post Deployments', desc: 'Guard duty post allocation engine and active deployments' },
  { key: 'posts', label: 'Security Duty Posts', desc: 'Duty post definitions, priority ranks, and bay requirements' },
  { key: 'devices', label: 'Biometric Devices', desc: 'Biometric reader terminal management and device sync' },
  { key: 'alerts', label: 'Alert Center', desc: 'Real-time security alert logs and incident handling' },
  { key: 'reports', label: 'System Reports', desc: 'Historical vacancy, attendance, and deployment reports' },
  { key: 'shifts', label: 'Shift Master', desc: 'Shift schedules, timing boundaries, and grace windows' },
  { key: 'employees', label: 'Employees Master', desc: 'Employee personnel records and guard roster management' },
];

const ROLES_LIST = ['ADMIN', 'SUPERVISOR', 'CONTROLROOM', 'USER'];

const AccessRightsPage = () => {
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [permissionsMatrix, setPermissionsMatrix] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { guideMode } = useGuide();
  const { refreshPermissions } = useAccessRights();

  const fetchAccessRights = async () => {
    setLoading(true);
    try {
      const res = await api.get('/access-rights');
      setPermissionsMatrix(res.data.data || {});
    } catch (err) {
      console.error('Fetch access rights error:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to load access rights', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessRights();
  }, []);

  const handleToggleModule = (modKey, checked) => {
    setPermissionsMatrix((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [modKey]: {
          ...(prev[selectedRole]?.[modKey] || { accessLevel: 'FULL_ACCESS' }),
          enabled: checked,
        },
      },
    }));
  };

  const handleAccessLevelChange = (modKey, accessLevel) => {
    setPermissionsMatrix((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [modKey]: {
          ...(prev[selectedRole]?.[modKey] || { enabled: true }),
          accessLevel,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/access-rights', permissionsMatrix);
      if (res.data?.data) {
        setPermissionsMatrix(res.data.data);
      }
      enqueueSnackbar('Access Rights permissions matrix updated successfully!', { variant: 'success' });
      await refreshPermissions();
    } catch (err) {
      console.error('Update access rights error:', err);
      enqueueSnackbar(err.response?.data?.message || 'Failed to update access rights', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const currentRolePerms = permissionsMatrix[selectedRole] || {};

  return (
    <Box>
      {/* Guide Banner */}
      {guideMode && (
        <Alert
          icon={<InfoIcon fontSize="inherit" />}
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(30, 58, 138, 0.25)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#f8fafc',
            '& .MuiAlert-icon': { color: '#60a5fa' },
          }}
        >
          <AlertTitle sx={{ fontWeight: 700, fontSize: '1rem', color: '#93c5fd' }}>
            SuperAdmin Access Control & Granular RBAC Guide
          </AlertTitle>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
            This exclusive SuperAdmin module provides master control over page availability and action authorization across all system roles.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Page Access:</strong> Completely enable or hide pages from navigation and restrict backend API routes.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>View Only vs Full Access:</strong> Control if a role can create/update records or view data strictly in read-only mode.
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AccessIcon color="secondary" sx={{ fontSize: 36 }} />
            Access Rights Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure system module visibility and action authorization rules per security role
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={loading || saving}
          sx={{ height: 42, px: 3, fontWeight: 700, borderRadius: 2 }}
        >
          {saving ? 'Saving...' : 'Save Access Rights'}
        </Button>
      </Box>

      {/* Role Tabs */}
      <Paper sx={{ mb: 3, backgroundColor: '#111827', borderRadius: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
        <Tabs
          value={selectedRole}
          onChange={(e, val) => setSelectedRole(val)}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, pt: 1 }}
        >
          {ROLES_LIST.map((role) => (
            <Tab
              key={role}
              value={role}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {role}
                  </Typography>
                  <Chip
                    label={role === 'ADMIN' ? 'High Privilege' : 'Standard'}
                    size="small"
                    color={role === 'ADMIN' ? 'primary' : 'default'}
                    sx={{ height: 18, fontSize: '0.65rem' }}
                  />
                </Box>
              }
              sx={{ minHeight: 48, textTransform: 'none', px: 3 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Main Permissions Matrix */}
      {loading ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading access rights configuration...
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {MODULE_DEFINITIONS.map((mod) => {
            const modConfig = currentRolePerms[mod.key] || { enabled: true, accessLevel: 'FULL_ACCESS' };
            const isEnabled = modConfig.enabled !== false;
            const accessLevel = modConfig.accessLevel || 'FULL_ACCESS';

            return (
              <Grid item xs={12} md={6} lg={4} key={mod.key}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: isEnabled ? 'rgba(59, 130, 246, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                    backgroundColor: isEnabled ? '#111827' : 'rgba(17, 24, 39, 0.5)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, color: isEnabled ? '#f8fafc' : 'text.disabled' }}>
                          {mod.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.3 }}>
                          {mod.desc}
                        </Typography>
                      </Box>
                      <Chip
                        icon={isEnabled ? <ActiveIcon /> : <DisabledIcon />}
                        label={isEnabled ? 'Enabled' : 'Disabled'}
                        size="small"
                        color={isEnabled ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                      />
                    </Box>

                    <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.08)' }} />

                    {/* Page Level Toggle */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Page Visibility
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isEnabled}
                            onChange={(e) => handleToggleModule(mod.key, e.target.checked)}
                            color="primary"
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="caption" color={isEnabled ? 'text.primary' : 'text.disabled'}>
                            {isEnabled ? 'Visible in Navigation' : 'Hidden & Blocked'}
                          </Typography>
                        }
                      />
                    </Box>

                    {/* Action Authorization Level */}
                    <Box sx={{ opacity: isEnabled ? 1 : 0.4, pointerEvents: isEnabled ? 'auto' : 'none' }}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary', mb: 1 }}>
                          Action Authorization Rights
                        </FormLabel>
                        <RadioGroup
                          value={accessLevel}
                          onChange={(e) => handleAccessLevelChange(mod.key, e.target.value)}
                        >
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1,
                              mb: 1,
                              borderColor: accessLevel === 'FULL_ACCESS' ? 'primary.main' : 'rgba(255,255,255,0.08)',
                              backgroundColor: accessLevel === 'FULL_ACCESS' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                              borderRadius: 1.5,
                            }}
                          >
                            <FormControlLabel
                              value="FULL_ACCESS"
                              control={<Radio size="small" />}
                              label={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <FullAccessIcon fontSize="small" color="primary" />
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                      Full Access
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Can view, create, edit, & delete records
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </Paper>

                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1,
                              borderColor: accessLevel === 'VIEW_ONLY' ? 'secondary.main' : 'rgba(255,255,255,0.08)',
                              backgroundColor: accessLevel === 'VIEW_ONLY' ? 'rgba(244, 63, 94, 0.08)' : 'transparent',
                              borderRadius: 1.5,
                            }}
                          >
                            <FormControlLabel
                              value="VIEW_ONLY"
                              control={<Radio size="small" />}
                              label={
                                <Box display="flex" alignItems="center" gap={1}>
                                  <ViewOnlyIcon fontSize="small" color="secondary" />
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                      View Only
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Read-only access (action buttons hidden)
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                            />
                          </Paper>
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default AccessRightsPage;
