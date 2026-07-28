import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useGuide } from '../contexts/GuideContext';
import { useSnackbar } from 'notistack';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  ListItemText,
} from '@mui/material';
import {
  People as PeopleIcon,
  AssignmentTurnedIn as DeployedIcon,
  Warning as AlertIcon,
  PhonelinkSetup as DeviceIcon,
  AutoAwesome as TriggerIcon,
  Refresh as RefreshIcon,
  Fingerprint as PunchIcon,
  RestartAlt as ResetIcon,
  Terminal as TerminalIcon,
  ExpandMore as ExpandMoreIcon,
  Female as FemaleIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [unpunchedGuards, setUnpunchedGuards] = useState([]);
  const [selectedEmpNos, setSelectedEmpNos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [punching, setPunching] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Live Socket.IO Activity Log Stream
  const [activityLogs, setActivityLogs] = useState([]);
  const { guideMode } = useGuide();
  const { enqueueSnackbar } = useSnackbar();

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setActivityLogs((prev) => [{ id: Date.now() + Math.random(), timestamp, message, type }, ...prev.slice(0, 49)]);
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, vacanciesRes, alertsRes, unpunchedRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/vacancies'),
        api.get('/dashboard/alerts'),
        api.get('/simulation/unpunched-guards'),
      ]);

      setStats(statsRes.data.data);
      setVacancies(vacanciesRes.data.data || []);
      setAlerts(alertsRes.data.data || []);
      setUnpunchedGuards(unpunchedRes.data.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Setup Socket.IO Real-time listeners
    const socket = getSocket();
    socket.connect();

    socket.on('DashboardUpdated', () => {
      fetchDashboardData();
    });

    socket.on('AttendanceReceived', (data) => {
      addLog(`Biometric Punch Received: Guard #${data.EmpNo} (${data.GuardName}) checked in at ${data.Time}`, 'punch');
      fetchDashboardData();
    });

    socket.on('AllocationCreated', (data) => {
      addLog(`Guard Deployed: Emp #${data.EmpNo} allocated to ${data.PostName}`, 'allocation');
      fetchDashboardData();
    });

    return () => {
      socket.off('DashboardUpdated');
      socket.off('AttendanceReceived');
      socket.off('AllocationCreated');
    };
  }, []);

  // 1. Simulate Guard Punch (Supports Batch / Multi-Select)
  const handleSimulatePunch = async (empNosOverride = null) => {
    setPunching(true);
    try {
      const empNosToPunch = empNosOverride || selectedEmpNos;
      const payload = empNosToPunch.length > 0 ? { empNos: empNosToPunch } : {};

      const res = await api.post('/simulation/punch', payload);
      enqueueSnackbar(res.data.message, { variant: 'success' });
      addLog(res.data.message, 'success');
      setSelectedEmpNos([]);
      fetchDashboardData();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Biometric Punch Simulation failed';
      enqueueSnackbar(errMsg, { variant: 'warning' });
      addLog(`Punch Failed: ${errMsg}`, 'error');
    } finally {
      setPunching(false);
    }
  };

  // 2. Trigger Auto-Allocation Engine
  const handleTriggerAllocation = async () => {
    setAllocating(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await api.post('/deployments/allocate', { date: today, shiftCode: 1 });
      const allocatedCount = res.data.data?.allocatedCount || 0;
      const resultMessage = res.data.message || res.data.data?.message || 'Allocation cycle finished.';

      if (allocatedCount > 0) {
        enqueueSnackbar(`Success! ${allocatedCount} Guard(s) automatically allocated to duty posts.`, { variant: 'success' });
        addLog(`Auto-Allocation Engine: ${allocatedCount} Guard(s) deployed to duty posts!`, 'allocation');
      } else {
        enqueueSnackbar(`${resultMessage} (Tip: Click "Simulate Guard Punch" to punch in guards first)`, { variant: 'info' });
        addLog(`Auto-Allocation Engine: ${resultMessage}`, 'info');
      }
      fetchDashboardData();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Allocation Engine execution failed', { variant: 'error' });
      addLog(`Allocation Error: ${err.message}`, 'error');
    } finally {
      setAllocating(false);
    }
  };

  // 3. Reset Simulation Data Back to Clean State
  const handleResetSimulation = async () => {
    if (!window.confirm("Are you sure you want to reset today's simulation data? This will clear today's attendance punches and guard deployments so you can re-test from scratch.")) {
      return;
    }
    setResetting(true);
    try {
      const res = await api.post('/simulation/reset');
      enqueueSnackbar(res.data.message, { variant: 'info' });
      addLog("Today's simulation data reset back to clean slate.", 'system');
      fetchDashboardData();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Reset failed', { variant: 'error' });
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    { title: 'Total Active Guards', value: stats?.totalRegisteredEmployees ?? stats?.totalGuards ?? 0, icon: <PeopleIcon fontSize="large" color="primary" />, color: '#3b82f6' },
    { title: 'Today Deployed', value: stats?.guardsAllocated ?? stats?.deployedGuards ?? 0, icon: <DeployedIcon fontSize="large" color="success" />, color: '#10b981' },
    { title: 'Post Vacancies', value: stats?.vacantPosts ?? 0, icon: <AlertIcon fontSize="large" color="warning" />, color: '#f59e0b' },
    { title: 'Active Devices', value: `${stats?.devicesStatus?.online ?? stats?.onlineDevices ?? 0}/${stats?.devicesStatus?.total ?? stats?.totalDevices ?? 0}`, icon: <DeviceIcon fontSize="large" color="info" />, color: '#06b6d4' },
  ];

  return (
    <Box>
      {/* Contextual User Guidance Banner */}
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
            Control Room Dashboard & Simulation Engine Guide
          </AlertTitle>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
            This central control room panel gives real-time visibility over biometric attendance streams, duty post capacity, and vacancy alerts.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Multi-Guard Punch:</strong> Select multiple guards to simulate biometric IN punches in batch.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Auto-Allocation Engine:</strong> Evaluates pending guard punches, checks post constraints, and deploys guards instantly.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Reset Simulation:</strong> Clears today's punches & guard allocations back to a clean state for infinite re-tests.
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Header & Simulation Control Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Security Control Room Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time biometric attendance & automated guard post allocation control
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
          {/* Guard Selector Multi-Select Dropdown */}
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel id="guard-select-label" sx={{ color: '#94a3b8' }}>Pick Guard(s) to Punch</InputLabel>
            <Select
              labelId="guard-select-label"
              multiple
              value={selectedEmpNos}
              label="Pick Guard(s) to Punch"
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('SELECT_ALL')) {
                  if (selectedEmpNos.length === unpunchedGuards.length) {
                    setSelectedEmpNos([]);
                  } else {
                    setSelectedEmpNos(unpunchedGuards.map((g) => g.EmpNo));
                  }
                } else {
                  setSelectedEmpNos(typeof val === 'string' ? val.split(',') : val);
                }
              }}
              renderValue={(selected) => {
                if (selected.length === 0) return <em>Auto (Next Available Guard)</em>;
                if (selected.length === 1) {
                  const g = unpunchedGuards.find((item) => item.EmpNo === selected[0]);
                  return g ? `#${g.EmpNo} - ${g.FirstName} ${g.LastName}` : selected[0];
                }
                return <Chip label={`${selected.length} Guards Selected`} color="secondary" size="small" />;
              }}
              sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#f8fafc' }}
            >
              {unpunchedGuards.length > 0 && (
                <MenuItem value="SELECT_ALL" sx={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <Checkbox checked={selectedEmpNos.length === unpunchedGuards.length} size="small" />
                  <ListItemText primary={selectedEmpNos.length === unpunchedGuards.length ? "Deselect All Guards" : "Select All Unpunched Guards"} />
                </MenuItem>
              )}
              {unpunchedGuards.map((g) => (
                <MenuItem key={g.EmpNo} value={g.EmpNo}>
                  <Checkbox checked={selectedEmpNos.indexOf(g.EmpNo) > -1} size="small" />
                  <ListItemText primary={`#${g.EmpNo} - ${g.FirstName} ${g.LastName} (${g.Gender === 'F' ? 'Female 👩' : 'Male 👨'})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title={selectedEmpNos.length > 0 ? `Simulate Punch for ${selectedEmpNos.length} Selected Guard(s)` : "Simulate Biometric IN Punch"}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={punching ? <CircularProgress size={18} color="inherit" /> : <PunchIcon />}
              onClick={() => handleSimulatePunch()}
              disabled={punching}
              sx={{ px: 2 }}
            >
              {selectedEmpNos.length > 1 ? `Punch ${selectedEmpNos.length} Guards` : 'Simulate Guard Punch'}
            </Button>
          </Tooltip>

          {/* Quick Female Guard Punch Shortcut Button */}
          <Tooltip title="Quickly Punch a Female Guard (To test Female-only Frisking Bay rule)">
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FemaleIcon />}
              onClick={async () => {
                const femaleGuards = unpunchedGuards.filter((g) => g.Gender === 'F');
                if (femaleGuards.length > 0) {
                  await handleSimulatePunch([femaleGuards[0].EmpNo]);
                } else {
                  enqueueSnackbar('No unpunched female guards remaining for today.', { variant: 'info' });
                }
              }}
              disabled={punching}
            >
              Punch Female Guard
            </Button>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={allocating ? <CircularProgress size={20} color="inherit" /> : <TriggerIcon />}
            onClick={handleTriggerAllocation}
            disabled={allocating}
            sx={{ px: 2.5 }}
          >
            Run Auto-Allocation Engine
          </Button>

          <Tooltip title="Reset Today's Attendance & Deployments (Clean Slate)">
            <IconButton
              color="warning"
              onClick={handleResetSimulation}
              disabled={resetting}
              sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', p: 1 }}
            >
              {resetting ? <CircularProgress size={20} color="warning" /> : <ResetIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Metric Cards Grid */}
      <Grid container spacing={3} mb={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="glass-card" sx={{ borderLeft: `4px solid ${card.color}` }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Grid: Duty Post Vacancies & Critical Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card className="glass-card">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Duty Post Vacancy Status (Shift 1)
                </Typography>
                <Chip label="Live Engine Stream" color="primary" size="small" />
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Duty Post Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Required</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Allocated</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Vacant</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vacancies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No post vacancies recorded.
                        </TableCell>
                      </TableRow>
                    ) : (
                      vacancies.map((row) => (
                        <TableRow key={row.VacancyCode} hover>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {row.post?.PostName}
                            {row.post?.CriticalPost === 'Y' && (
                              <Chip label="CRITICAL" color="error" size="small" sx={{ ml: 1, fontSize: '0.65rem', height: 18 }} />
                            )}
                          </TableCell>
                          <TableCell>{row.post?.postCategory?.PostCategoryName || 'N/A'}</TableCell>
                          <TableCell align="center">{row.RequiredGuards}</TableCell>
                          <TableCell align="center">{row.AllocatedGuards}</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, color: row.VacantGuards > 0 ? '#ef4444' : '#10b981' }}>
                            {row.VacantGuards}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={row.Status}
                              color={row.Status === 'FILLED' ? 'success' : row.Status === 'PARTIAL' ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="glass-card">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Critical Post Alerts
                </Typography>
                <Chip label={alerts.length} color="error" size="small" />
              </Box>

              {alerts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No active critical alerts. All required posts are covered!
                </Typography>
              ) : (
                alerts.map((alert) => (
                  <Box
                    key={alert.AlertCode}
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <AlertIcon color="error" fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f87171' }}>
                        {alert.post?.PostName || alert.AlertType}
                      </Typography>
                    </Box>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {alert.AlertMessage}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Real-time Socket.IO Control Room Activity Log Stream Drawer */}
      <Box mt={3}>
        <Accordion
          defaultExpanded
          sx={{
            bgcolor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '8px !important',
            overflow: 'hidden',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#60a5fa' }} />}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <TerminalIcon sx={{ color: '#60a5fa' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#93c5fd' }}>
                Control Room Activity Stream (Socket.IO Real-time Events)
              </Typography>
              <Chip label={`${activityLogs.length} Events`} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#090d16', fontFamily: 'monospace', maxHeight: 220, overflowY: 'auto' }}>
            {activityLogs.length === 0 ? (
              <Typography variant="caption" color="text.secondary">
                Listening for real-time events... Click "Simulate Guard Punch" or "Run Auto-Allocation Engine" above.
              </Typography>
            ) : (
              activityLogs.map((log) => (
                <Box key={log.id} display="flex" gap={1.5} py={0.3} sx={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <Typography variant="caption" sx={{ color: '#64748b', minWidth: 70 }}>
                    [{log.timestamp}]
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        log.type === 'punch'
                          ? '#a7f3d0'
                          : log.type === 'allocation'
                          ? '#93c5fd'
                          : log.type === 'error'
                          ? '#fca5a5'
                          : log.type === 'success'
                          ? '#6ee7b7'
                          : '#cbd5e1',
                    }}
                  >
                    {log.message}
                  </Typography>
                </Box>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default DashboardPage;
