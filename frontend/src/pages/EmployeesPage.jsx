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
  TextField,
  CircularProgress,
  Pagination,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { InfoOutlined as InfoIcon, People as PeopleIcon } from '@mui/icons-material';

const CATEGORY_COLORS = {
  1: { label: 'Un-Skilled', color: 'default' },
  2: { label: 'Semi-Skilled', color: 'info' },
  3: { label: 'Skilled', color: 'primary' },
  4: { label: 'High-Skilled', color: 'error' },
};

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
            Employee Master Guide
          </AlertTitle>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
            This administrative module manages security staff personnel records, department assignments, skill tier categories, and employee contact details.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Skill Tiers:</strong> High-Skilled & Skilled (Critical Posts), Semi-Skilled (Priority 2 & 3 Posts), Un-Skilled (Priority 4 & 5 Posts).
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Personnel Details:</strong> Department, designation, gender, and biometric punch card numbers.
            </Typography>
          </Box>
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PeopleIcon color="primary" sx={{ fontSize: 32 }} />
            Employee Master
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage security staff personnel records, skill categories, and contact details
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
            sx={{ minWidth: 280 }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Emp No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Department & Designation</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Skill Category</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Gender</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Punch Card #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone No.</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((emp) => {
                    const email = emp.personal?.Email || emp.Email || '-';
                    const phone = emp.personal?.Mobile || emp.personal?.PhoneNo || emp.Phone || '-';

                    return (
                      <TableRow key={emp.EmpNo} hover>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>#{emp.EmpNo}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {emp.FirstName} {emp.LastName}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{emp.department?.DepartmentName || 'Security'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {emp.designation?.Designation || 'Guard'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {(() => {
                            const catCode = emp.CategoryCode || 1;
                            const catInfo = CATEGORY_COLORS[catCode] || { label: emp.category?.CategoryName || 'Un-Skilled', color: 'default' };
                            return (
                              <Chip
                                label={catInfo.label}
                                size="small"
                                color={catInfo.color}
                                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                              />
                            );
                          })()}
                        </TableCell>
                        <TableCell align="center">{emp.Gender === 'F' ? 'Female 👩' : 'Male 👨'}</TableCell>
                        <TableCell align="center" sx={{ fontFamily: 'monospace' }}>{emp.PunchCardNo || emp.EmpNo}</TableCell>
                        <TableCell sx={{ color: email !== '-' ? '#60a5fa' : 'text.secondary', fontSize: '0.85rem' }}>
                          {email}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          {phone}
                        </TableCell>
                      </TableRow>
                    );
                  })
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
