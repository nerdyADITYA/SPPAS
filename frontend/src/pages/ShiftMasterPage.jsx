import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useGuide } from '../contexts/GuideContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  CircularProgress,
  Alert,
  AlertTitle,
  InputAdornment,
} from '@mui/material';
import {
  InfoOutlined as InfoIcon,
  Search as SearchIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const formatTime = (val) => {
  if (!val) return '-';
  if (typeof val === 'string') {
    if (val.includes('T')) {
      const parts = val.split('T')[1].split('.')[0];
      return parts;
    }
    return val;
  }
  if (val instanceof Date || !isNaN(new Date(val).getTime())) {
    const d = new Date(val);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const seconds = String(d.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  return String(val);
};

const ShiftMasterPage = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { guideMode } = useGuide();

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shifts');
      setShifts(res.data.data || []);
    } catch (err) {
      console.error('Fetch shifts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const filteredShifts = shifts.filter((shift) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      String(shift.ShiftCode).includes(term) ||
      (shift.Shift && shift.Shift.toLowerCase().includes(term)) ||
      (shift.Statutory && shift.Statutory.toLowerCase().includes(term))
    );
  });

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
            Shift Master Configuration Guide
          </AlertTitle>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
            This page provides a read-only master reference of all guard shift schedules, timing thresholds, grace periods, overtime boundaries, and automated allocation windows defined in the system database.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Shift Timings:</strong> Start and end operational hours for rotational shifts.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Grace Periods:</strong> Permitted start/end attendance grace windows before flagging alerts.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Allocation Window:</strong> Automated deployment trigger window for security personnel allocation.
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <TimeIcon color="primary" sx={{ fontSize: 32 }} />
            Shift Master Table
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Master database records for guard duty shifts, timings, grace intervals, and allocation schedules
          </Typography>
        </Box>
      </Box>

      {/* Search Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
          <TextField
            label="Search Shift Code or Name"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 280 }}
          />
        </CardContent>
      </Card>

      {/* Table Container */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Shift Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Statutory</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Shift Start</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Shift End</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Full Day Hrs</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Lunch Hrs</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Grace Start</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Grace End</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Alloc. Start</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Alloc. End</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={36} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Loading Shift Master records...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredShifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No shift records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShifts.map((shift) => (
                    <TableRow key={shift.ShiftCode} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                        #{shift.ShiftCode}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {shift.Shift || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={shift.Statutory || 'Standard'}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem', height: 22 }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>
                        {formatTime(shift.ShiftStartTime)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>
                        {formatTime(shift.ShiftEndTime)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace' }}>
                        {formatTime(shift.FullDayHrs)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace' }}>
                        {formatTime(shift.LunchHrs)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace', color: '#fbbf24' }}>
                        {formatTime(shift.GraceAfterShiftStart)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace', color: '#fbbf24' }}>
                        {formatTime(shift.GraceBeforeShiftEnd)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace', color: '#4ade80' }}>
                        {formatTime(shift.ShiftAlocation_StartTime)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'monospace', color: '#4ade80' }}>
                        {formatTime(shift.ShiftAlocation_EndTime)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={shift.Enable === 'Y' ? 'Active' : 'Inactive'}
                          size="small"
                          color={shift.Enable === 'Y' ? 'success' : 'default'}
                          sx={{ fontWeight: 600, height: 22, fontSize: '0.7rem' }}
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
    </Box>
  );
};

export default ShiftMasterPage;
