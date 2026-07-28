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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Add as AddIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { guideMode } = useGuide();

  const [formData, setFormData] = useState({
    PostName: '',
    PostShortName: '',
    PostCategoryCode: '',
    Priority: 1,
    MinimumGuards: 1,
    MaximumGuards: 1,
    CriticalPost: 'N',
    FemaleOnly: 'N',
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/posts'),
        api.get('/post-categories'),
      ]);
      setPosts(pRes.data.data || []);
      setCategories(cRes.data.data || []);
    } catch (err) {
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    try {
      await api.post('/posts', formData);
      setOpenModal(false);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Create post failed');
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
            Security Duty Posts Module Guide
          </AlertTitle>
          <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.9 }}>
            This master module configures security posts, capacity bounds (min/max guards), allocation priorities, and special business constraints.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 1, pt: 0.5, borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Priority Rating (1 = Highest):</strong> Determines sequence during automatic guard allocation.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Critical Post:</strong> High-risk locations (e.g. Data Center, Main Gates) prioritized before standard posts.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Female Only:</strong> Mandatory restriction requiring female security personnel (e.g. Female Frisking Bay).
            </Typography>
          </Box>
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Security Duty Post Master
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure post requirements, priorities, and allocation constraints
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Add New Duty Post
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Post Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Min Guards</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Max Guards</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Critical</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Female Only</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No duty posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((p) => (
                    <TableRow key={p.PostCode} hover>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {p.PostName} ({p.PostShortName})
                      </TableCell>
                      <TableCell>{p.postCategory?.PostCategoryName}</TableCell>
                      <TableCell align="center">
                        <Chip label={`Priority ${p.Priority}`} size="small" color={p.Priority === 1 ? 'error' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
                      </TableCell>
                      <TableCell align="center">{p.MinimumGuards}</TableCell>
                      <TableCell align="center">{p.MaximumGuards}</TableCell>
                      <TableCell align="center">
                        {p.CriticalPost === 'Y' ? (
                          <Chip label="YES" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem' }} />
                        ) : (
                          'NO'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {p.FemaleOnly === 'Y' ? (
                          <Chip label="YES" size="small" color="secondary" sx={{ height: 20, fontSize: '0.7rem' }} />
                        ) : (
                          'NO'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={p.Enable === 'Y' ? 'ACTIVE' : 'INACTIVE'} size="small" color={p.Enable === 'Y' ? 'success' : 'default'} sx={{ height: 20, fontSize: '0.7rem' }} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Post Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Configure New Duty Post</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Post Full Name"
            fullWidth
            value={formData.PostName}
            onChange={(e) => setFormData({ ...formData, PostName: e.target.value })}
          />
          <TextField
            label="Post Short Code"
            fullWidth
            value={formData.PostShortName}
            onChange={(e) => setFormData({ ...formData, PostShortName: e.target.value })}
            placeholder="e.g. NG-1"
          />
          <TextField
            select
            label="Category"
            fullWidth
            value={formData.PostCategoryCode}
            onChange={(e) => setFormData({ ...formData, PostCategoryCode: e.target.value })}
          >
            {categories.map((c) => (
              <MenuItem key={c.PostCategoryCode} value={c.PostCategoryCode}>
                {c.PostCategoryName}
              </MenuItem>
            ))}
          </TextField>
          <Box display="flex" gap={2}>
            <TextField
              label="Priority (1-5)"
              type="number"
              fullWidth
              value={formData.Priority}
              onChange={(e) => setFormData({ ...formData, Priority: Number(e.target.value) })}
            />
            <TextField
              label="Min Guards"
              type="number"
              fullWidth
              value={formData.MinimumGuards}
              onChange={(e) => setFormData({ ...formData, MinimumGuards: Number(e.target.value) })}
            />
            <TextField
              label="Max Guards"
              type="number"
              fullWidth
              value={formData.MaximumGuards}
              onChange={(e) => setFormData({ ...formData, MaximumGuards: Number(e.target.value) })}
            />
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={formData.CriticalPost === 'Y'}
                onChange={(e) => setFormData({ ...formData, CriticalPost: e.target.checked ? 'Y' : 'N' })}
                color="error"
              />
            }
            label="Critical Post (Highest Allocation Priority)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.FemaleOnly === 'Y'}
                onChange={(e) => setFormData({ ...formData, FemaleOnly: e.target.checked ? 'Y' : 'N' })}
                color="secondary"
              />
            }
            label="Female Security Only Restriction"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreatePost}>
            Save Duty Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsPage;
