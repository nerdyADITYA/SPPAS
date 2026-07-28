import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useGuide } from '../contexts/GuideContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  PhonelinkSetup as DeviceIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { guideMode } = useGuide();

  const [formData, setFormData] = useState({
    DeviceName: '',
    DeviceSerialNo: '',
    DeviceModel: 'ZKTeco F22',
    IPAddress: '',
    PortNo: 4370,
  });

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/devices');
      setDevices(res.data.data || []);
    } catch (err) {
      console.error('Fetch devices error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleCreateDevice = async () => {
    try {
      await api.post('/devices', formData);
      setOpenModal(false);
      fetchDevices();
    } catch (err) {
      alert(err.response?.data?.message || 'Create device failed');
    }
  };

  return (
    <Box>
      {/* Module Overview Banner */}
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
            Biometric Hardware & Device Master Guide
          </AlertTitle>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
            Monitors ZKTeco / SilkFP biometric reader terminals installed across plant sectors. Background python service polls device TCP/IP sockets for punches and heartbeats.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>ONLINE (Green):</strong> Reader active and receiving heartbeats every 60s.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>OFFLINE (Red):</strong> Network disconnect detected; triggers an automated alert in Alert Center.
            </Typography>
          </Box>
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Biometric Device Master
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hardware terminal network IP addresses and communication status
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <IconButton onClick={fetchDevices} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Register Biometric Reader
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={36} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {devices.map((dev) => (
            <Grid item xs={12} sm={6} md={4} key={dev.DeviceCode}>
              <Card sx={{ height: '100%', position: 'relative' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(6, 182, 212, 0.15)', color: 'info.main' }}>
                      <DeviceIcon />
                    </Box>
                    <Chip
                      label={dev.DeviceStatus}
                      size="small"
                      color={dev.DeviceStatus === 'ONLINE' ? 'success' : 'error'}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                    {dev.DeviceName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    Model: {dev.DeviceModel || 'ZKTeco'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    S/N: {dev.DeviceSerialNo || 'N/A'}
                  </Typography>

                  <Box mt={2} pt={1.5} sx={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      IP Address: <strong>{dev.IPAddress}:{dev.PortNo}</strong>
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Last Heartbeat: {dev.LastHeartbeat ? new Date(dev.LastHeartbeat).toLocaleTimeString() : 'N/A'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Register Device Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Register New Biometric Reader</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Device Terminal Name"
            fullWidth
            value={formData.DeviceName}
            onChange={(e) => setFormData({ ...formData, DeviceName: e.target.value })}
            placeholder="e.g. North Gate Main Reader"
          />
          <TextField
            label="Serial Number"
            fullWidth
            value={formData.DeviceSerialNo}
            onChange={(e) => setFormData({ ...formData, DeviceSerialNo: e.target.value })}
            placeholder="e.g. ZK-NG-009"
          />
          <TextField
            label="Device Model"
            fullWidth
            value={formData.DeviceModel}
            onChange={(e) => setFormData({ ...formData, DeviceModel: e.target.value })}
          />
          <Box display="flex" gap={2}>
            <TextField
              label="IP Address"
              fullWidth
              value={formData.IPAddress}
              onChange={(e) => setFormData({ ...formData, IPAddress: e.target.value })}
              placeholder="192.168.1.110"
            />
            <TextField
              label="Port Number"
              type="number"
              fullWidth
              value={formData.PortNo}
              onChange={(e) => setFormData({ ...formData, PortNo: Number(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateDevice}>
            Save Device Terminal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DevicesPage;
