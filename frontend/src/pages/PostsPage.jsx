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
  IconButton,
  Tooltip,
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
import {
  Add as AddIcon,
  InfoOutlined as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAccessRights } from '../contexts/AccessRightsContext';

const PRIORITY_OPTIONS = [
  { value: 1, label: '1 (Critical)', color: 'error' },
  { value: 2, label: '2 (High)', color: 'warning' },
  { value: 3, label: '3 (Medium)', color: 'info' },
  { value: 4, label: '4 (Low)', color: 'default' },
  { value: 5, label: '5 (Very Low)', color: 'default' },
];

const INITIAL_FORM_DATA = {
  PostName: '',
  PostShortName: '',
  PostCategoryCode: '',
  Priority: 1,
  MinimumGuards: 1,
  MaximumGuards: 1,
  CriticalPost: 'Y',
  FemaleOnly: 'N',
  Enable: 'Y',
};

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const { guideMode } = useGuide();
  const { canMutate } = useAccessRights();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

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

  const handleOpenAddModal = () => {
    setSelectedPost(null);
    setFormData({
      ...INITIAL_FORM_DATA,
      PostCategoryCode: categories.length > 0 ? categories[0].PostCategoryCode : '',
    });
    setOpenModal(true);
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setFormData({
      PostName: post.PostName || '',
      PostShortName: post.PostShortName || '',
      PostCategoryCode: post.PostCategoryCode || (categories.length > 0 ? categories[0].PostCategoryCode : ''),
      Priority: Number(post.Priority) || 1,
      MinimumGuards: Number(post.MinimumGuards) || 1,
      MaximumGuards: Number(post.MaximumGuards) || 1,
      CriticalPost: post.CriticalPost || (Number(post.Priority) === 1 ? 'Y' : 'N'),
      FemaleOnly: post.FemaleOnly || 'N',
      Enable: post.Enable || 'Y',
    });
    setOpenModal(true);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setOpenDeleteDialog(true);
  };

  const handlePriorityChange = (newPriority) => {
    const val = Number(newPriority);
    setFormData({
      ...formData,
      Priority: val,
      CriticalPost: val === 1 ? 'Y' : 'N',
    });
  };

  const handleSavePost = async () => {
    try {
      const payload = {
        ...formData,
        CriticalPost: Number(formData.Priority) === 1 ? 'Y' : 'N',
      };

      if (selectedPost) {
        await api.put(`/posts/${selectedPost.PostCode}`, payload);
      } else {
        await api.post('/posts', payload);
      }

      setOpenModal(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Save post failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await api.delete(`/posts/${postToDelete.PostCode}`);
      setOpenDeleteDialog(false);
      setPostToDelete(null);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete post failed');
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
              • <strong>Priority Rating:</strong> Priority 1 is automatically designated as <strong>Critical</strong> and allocated first.
            </Typography>
            <Typography variant="caption" sx={{ color: '#bfdbfe' }}>
              • <strong>Critical Tag:</strong> Automatically set to YES exclusively for Priority 1 posts (e.g. Data Center, Main Gates).
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
            Configure post requirements, priority tiers (1-5), and allocation constraints
          </Typography>
        </Box>
        {canMutate('posts') && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddModal}
          >
            Add New Duty Post
          </Button>
        )}
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Post Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Priority</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Min Guards</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Max Guards</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Critical</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Female Only</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                  {canMutate('posts') && <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={canMutate('posts') ? 9 : 8} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canMutate('posts') ? 9 : 8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No duty posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((p) => {
                    const isCritical = Number(p.Priority) === 1;
                    const priorityOpt = PRIORITY_OPTIONS.find((opt) => opt.value === Number(p.Priority)) || {
                      label: `Priority ${p.Priority}`,
                      color: 'default',
                    };

                    return (
                      <TableRow key={p.PostCode} hover>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {p.PostName} ({p.PostShortName})
                        </TableCell>
                        <TableCell>{p.postCategory?.PostCategoryName}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`Priority ${p.Priority}`}
                            size="small"
                            color={priorityOpt.color}
                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">{p.MinimumGuards}</TableCell>
                        <TableCell align="center">{p.MaximumGuards}</TableCell>
                        <TableCell align="center">
                          {isCritical ? (
                            <Chip label="YES" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
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
                        {canMutate('posts') && (
                          <TableCell align="center">
                            <Box display="flex" justifyContent="center" gap={0.5}>
                              <Tooltip title="Edit Duty Post">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditClick(p)}
                                  sx={{ '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.15)' } }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Duty Post">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteClick(p)}
                                  sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.15)' } }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Configure / Edit Post Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedPost ? `Edit Duty Post: ${selectedPost.PostName}` : 'Configure New Duty Post'}
        </DialogTitle>
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
            {/* Priority Dropdown Select (1 to 5 with descriptions in brackets) */}
            <TextField
              select
              label="Priority"
              fullWidth
              value={formData.Priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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

          {/* Automatic Critical Tag Indicator */}
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: formData.Priority === 1 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: '1px solid',
              borderColor: formData.Priority === 1 ? 'error.main' : 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <Chip
              label={formData.Priority === 1 ? 'YES - CRITICAL POST' : 'NO - STANDARD POST'}
              size="small"
              color={formData.Priority === 1 ? 'error' : 'default'}
              sx={{ fontWeight: 700, fontSize: '0.7rem' }}
            />
            <Typography variant="caption" color="text.secondary">
              {formData.Priority === 1
                ? 'Automatically tagged as Critical (Highest allocation priority & emergency alert tracking)'
                : 'Standard priority post (No emergency alert tracking)'}
            </Typography>
          </Box>

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

          <FormControlLabel
            control={
              <Switch
                checked={formData.Enable === 'Y'}
                onChange={(e) => setFormData({ ...formData, Enable: e.target.checked ? 'Y' : 'N' })}
                color="success"
              />
            }
            label="Active Duty Post Status"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePost}>
            {selectedPost ? 'Update Duty Post' : 'Save Duty Post'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'error.main' }}>
          Confirm Delete Duty Post
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete duty post <strong>"{postToDelete?.PostName}"</strong> ({postToDelete?.PostShortName})?
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This action will permanently remove the duty post configuration.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsPage;
