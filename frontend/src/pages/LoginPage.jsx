import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Shield as ShieldIcon,
  Warning as WarningIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  Key as KeyIcon,
  AdminPanelSettings as SuperAdminIcon,
  SupervisorAccount as AdminIcon,
  Badge as SupervisorIcon,
  Monitor as ControlRoomIcon,
  Security as GuardIcon,
  TouchApp as AutoFillIcon,
} from '@mui/icons-material';

const LoginPage = () => {
  const [empNo, setEmpNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Concurrent Session Warning Dialog state
  const [concurrentModal, setConcurrentModal] = useState(false);
  const [concurrentInfo, setConcurrentInfo] = useState(null);

  const { login, forceLogin } = useAuth();
  const navigate = useNavigate();

  const handleAutoFill = (fillEmpNo, fillPass = 'Admin@123') => {
    setEmpNo(fillEmpNo);
    setPassword(fillPass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empNo || !password) {
      setError('Please enter both Employee Number and Password.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      const res = await login(empNo, password);
      if (res?.isConcurrent) {
        setConcurrentInfo(res.concurrentData);
        setConcurrentModal(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.code === 'CONCURRENT_LOGIN_DETECTED') {
        setConcurrentInfo(err.response.data.data);
        setConcurrentModal(true);
      } else {
        setError(err.response?.data?.message || 'Invalid login credentials. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleForceLogin = async () => {
    try {
      setSubmitting(true);
      setConcurrentModal(false);
      await forceLogin(empNo, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Force login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const roleGuide = [
    {
      role: 'SUPERADMIN',
      empNo: '1001',
      password: 'Admin@123',
      title: 'Super Administrator',
      icon: <SuperAdminIcon color="error" />,
      color: '#ef4444',
      scope: 'Full System Access (All 8 Modules)',
      capabilities: [
        'Employee Master & RBAC User Role Management',
        'Allocation Rule & Gender Restriction Configuration',
        'Duty Post & Biometric Device Terminal Master Data',
        'Simulation Engine & Multi-Guard Biometric Punching',
        'Automatic Guard Allocation Engine Execution',
        'Receives Urgent Critical Post Vacancy Email Alerts',
        'System Audit Reports with PDF & Excel Export',
      ],
    },
    {
      role: 'ADMIN',
      empNo: '1002',
      password: 'Admin@123',
      title: 'Security Administrator',
      icon: <AdminIcon color="warning" />,
      color: '#f59e0b',
      scope: 'Administrative Operations Access (7 Modules)',
      capabilities: [
        'Duty Post Master & Biometric Device Management',
        'Post Deployment Overrides & Vacancy Tracking',
        'Real-time Control Room Dashboard & Activity Stream',
        'Receives Critical Post Vacancy Email Alerts',
        'Export System Audit Reports (PDF & Excel)',
      ],
    },
    {
      role: 'SUPERVISOR',
      empNo: '1003',
      password: 'Admin@123',
      title: 'Shift Supervisor',
      icon: <SupervisorIcon color="primary" />,
      color: '#3b82f6',
      scope: 'Shift Operations Access (5 Modules)',
      capabilities: [
        'Daily Biometric Attendance Logs & Punch Stream',
        'Post Deployment Tracking & Manual Guard Allocation',
        'Duty Post Vacancy Status & Critical Alerts',
        'Shift Compliance & Daily Summary Reports',
      ],
    },
    {
      role: 'CONTROLROOM',
      empNo: '1004',
      password: 'Admin@123',
      title: 'Control Room Operator',
      icon: <ControlRoomIcon color="info" />,
      color: '#06b6d4',
      scope: 'Live Monitoring Access (3 Modules)',
      capabilities: [
        'Live Control Room Dashboard & Socket.IO Activity Stream',
        'Real-Time Biometric Punch Event Feed',
        'Device Status & Terminal Connectivity View',
      ],
    },
    {
      role: 'USER',
      empNo: '1005',
      password: 'Admin@123',
      title: 'Security Guard Personnel',
      icon: <GuardIcon color="success" />,
      color: '#10b981',
      scope: 'Employee Self-Service Access',
      capabilities: [
        'Personal Duty Post Deployment Assignment View',
        'Biometric Attendance Punch History Log',
      ],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #0b0f19 70%)',
        p: { xs: 2, md: 4 },
      }}
    >
      <Grid container spacing={4} maxWidth={1100} alignItems="stretch">
        {/* Left Column: Login Form */}
        <Grid item xs={12} md={5}>
          <Card
            className="glass-card"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 2,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            }}
          >
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <ShieldIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" align="center" sx={{ fontWeight: 700, mt: 1 }}>
                  SPPAS Portal
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                  Security Personnel Post Allocation System
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="empNo"
                  label="Employee Number (EmpNo)"
                  name="empNo"
                  autoComplete="username"
                  autoFocus
                  value={empNo}
                  onChange={(e) => setEmpNo(e.target.value)}
                  placeholder="e.g. 1001"
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{ py: 1.4, fontSize: '1rem', fontWeight: 600 }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </form>

              {/* Quick Auto-Fill Credentials Bar */}
              <Box mt={3}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1} textAlign="center">
                  Quick Auto-Fill Demo Credentials (Click to fill):
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center">
                  <Chip
                    label="1001 (SuperAdmin)"
                    size="small"
                    color="error"
                    onClick={() => handleAutoFill('1001')}
                    icon={<AutoFillIcon />}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="1002 (Admin)"
                    size="small"
                    color="warning"
                    onClick={() => handleAutoFill('1002')}
                    icon={<AutoFillIcon />}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="1003 (Supervisor)"
                    size="small"
                    color="primary"
                    onClick={() => handleAutoFill('1003')}
                    icon={<AutoFillIcon />}
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: User Roles & Access Capabilities Guide */}
        <Grid item xs={12} md={7}>
          <Card
            className="glass-card"
            sx={{
              height: '100%',
              p: 2,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                <KeyIcon color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Role-Based Access Credentials & Capabilities Guide
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Review default passwords, module permissions, and operational access by user role
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ maxHeight: 440, overflowY: 'auto', pr: 0.5 }}>
                {roleGuide.map((item, index) => (
                  <Accordion
                    key={index}
                    defaultExpanded={index === 0}
                    sx={{
                      bgcolor: 'rgba(15, 23, 42, 0.6)',
                      border: `1px solid ${item.color}40`,
                      borderRadius: '8px !important',
                      mb: 1.5,
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: item.color }} />}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" pr={1}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          {item.icon}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                              {item.title} ({item.role})
                            </Typography>
                            <Typography variant="caption" sx={{ color: item.color, fontWeight: 600 }}>
                              EmpNo: {item.empNo} | Password: {item.password}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: item.color, color: item.color, fontSize: '0.7rem', py: 0.2, px: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAutoFill(item.empNo, item.password);
                          }}
                        >
                          Auto-Fill
                        </Button>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', p: 2 }}>
                      <Chip
                        label={item.scope}
                        size="small"
                        sx={{ bgcolor: `${item.color}20`, color: item.color, fontWeight: 700, mb: 1.5, fontSize: '0.75rem' }}
                      />
                      <Typography variant="caption" display="block" sx={{ color: '#cbd5e1', fontWeight: 600, mb: 1 }}>
                        Available System Capabilities & Access Scope:
                      </Typography>
                      {item.capabilities.map((cap, capIdx) => (
                        <Typography key={capIdx} variant="caption" display="block" sx={{ color: '#94a3b8', pl: 1, mb: 0.5 }}>
                          • {cap}
                        </Typography>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Concurrent Active Session Warning Dialog */}
      <Dialog
        open={concurrentModal}
        onClose={() => setConcurrentModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: '#111827',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ef4444', fontWeight: 700 }}>
          <WarningIcon color="error" fontSize="large" />
          Active Session Detected!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 600, mb: 1.5 }}>
            Employee #{concurrentInfo?.user?.empNo} ({concurrentInfo?.user?.firstName} {concurrentInfo?.user?.lastName}) is currently logged in on another device.
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              mb: 2,
            }}
          >
            <Typography variant="caption" display="block" color="text.secondary">
              • Active Location: <strong>{concurrentInfo?.activeSession?.ipAddress || '127.0.0.1'}</strong>
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              • Session Started: <strong>{concurrentInfo?.activeSession?.loginTime ? new Date(concurrentInfo.activeSession.loginTime).toLocaleTimeString() : 'Recently'}</strong>
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>
            Logging in here will terminate the active session on the other device and authorize this browser window.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Button variant="outlined" color="inherit" onClick={() => setConcurrentModal(false)}>
            Cancel Login
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleForceLogin}
            disabled={submitting}
          >
            Force Login & Logout Other
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
