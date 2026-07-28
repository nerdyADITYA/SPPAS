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
  MenuItem,
  CircularProgress,
  Pagination,
  Alert,
  AlertTitle,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [empSearch, setEmpSearch] = useState('');

  const { guideMode } = useGuide();

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attendance', {
        params: {
          page,
          pageSize: 15,
          status: statusFilter || undefined,
          empNo: empSearch || undefined,
        },
      });
      setAttendance(res.data.data.data || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      console.error('Fetch attendance error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, statusFilter]);

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
            Biometric Attendance Logs Module Guide
          </AlertTitle>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
            This module captures raw fingerprint, facial recognition, and card punches transmitted from biometric devices via TCP/IP.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>PENDING:</strong> Fresh IN punch awaiting automated post allocation.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>ALLOCATED:</strong> Guard has been assigned to a post by the allocation engine.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>DUPLICATE Check:</strong> Prevents multiple punches within the single-punch window.
            </Typography>
          </Box>
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Biometric Attendance Logs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time biometric punch stream from reader terminals
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Search Employee #"
            variant="outlined"
            size="small"
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && fetchAttendance()}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Filter Status"
            variant="outlined"
            size="small"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="ALLOCATED">ALLOCATED</MenuItem>
            <MenuItem value="DUPLICATE">DUPLICATE</MenuItem>
            <MenuItem value="REJECTED">REJECTED</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Punch Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Device Reader</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Shift</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : attendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No biometric attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendance.map((row) => (
                    <TableRow key={row.AttendanceCode} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {new Date(row.PunchDateTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(row.PunchDateTime).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.employee?.FirstName} {row.employee?.LastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Emp #{row.EmpNo}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.device?.DeviceName || `Reader #${row.DeviceCode}`}</TableCell>
                      <TableCell align="center">Shift {row.ShiftCode}</TableCell>
                      <TableCell align="center">
                        <Chip label={row.PunchType || 'IN'} size="small" color="info" sx={{ height: 20, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={row.AttendanceStatus}
                          size="small"
                          color={
                            row.AttendanceStatus === 'ALLOCATED'
                              ? 'success'
                              : row.AttendanceStatus === 'PENDING'
                              ? 'warning'
                              : 'default'
                          }
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" p={2}>
            <Pagination count={totalPages} page={page} onChange={(e, p) => setPage(p)} color="primary" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AttendancePage;
