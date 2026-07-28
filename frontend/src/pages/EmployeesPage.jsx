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
  Select,
  Alert,
  AlertTitle,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const { guideMode } = useGuide();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/employees', {
        params: { page, pageSize: 15, search: search || undefined },
      });
      setEmployees(res.data.data.data || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      console.error('Fetch employees error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const handleRoleChange = async (empNo, newRole) => {
    try {
      await api.patch(`/employees/${empNo}/role`, { role: newRole });
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Update role failed');
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
            Employee Master & Role-Based Access Control (RBAC) Guide
          </AlertTitle>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
            This administrative module manages employee personnel records, department assignments, biometric punch cards, and system authorization roles.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>SUPERADMIN / ADMIN:</strong> Complete system control, master data management, and user role modification.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>SUPERVISOR / CONTROLROOM:</strong> Control room dashboard operations, manual deployment, and alert resolution.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>USER (Guard):</strong> Operational security personnel eligible for automated post allocations.
            </Typography>
          </Box>
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Employee Master & RBAC Roles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage security staff personnel records and system authorization permissions
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            label="Search Employee Name or #"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && fetchEmployees()}
            sx={{ minWidth: 250 }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Emp No</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department & Designation</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Gender</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Punch Card #</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Security RBAC Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp) => (
                    <TableRow key={emp.EmpNo} hover>
                      <TableCell sx={{ fontWeight: 600 }}>#{emp.EmpNo}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {emp.FirstName} {emp.LastName}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{emp.department?.DepartmentName || 'Security'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {emp.designation?.Designation || 'Guard'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{emp.Gender === 'F' ? 'Female 👩' : 'Male 👨'}</TableCell>
                      <TableCell align="center">{emp.PunchCardNo || emp.EmpNo}</TableCell>
                      <TableCell align="center">
                        <Select
                          size="small"
                          value={emp.SecurityRole}
                          onChange={(e) => handleRoleChange(emp.EmpNo, e.target.value)}
                          sx={{ height: 26, fontSize: '0.75rem' }}
                        >
                          <MenuItem value="SUPERADMIN">SUPERADMIN</MenuItem>
                          <MenuItem value="ADMIN">ADMIN</MenuItem>
                          <MenuItem value="SUPERVISOR">SUPERVISOR</MenuItem>
                          <MenuItem value="CONTROLROOM">CONTROLROOM</MenuItem>
                          <MenuItem value="USER">USER (Guard)</MenuItem>
                        </Select>
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

export default EmployeesPage;
