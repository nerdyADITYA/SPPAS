import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGuide } from '../contexts/GuideContext';
import { useAccessRights } from '../contexts/AccessRightsContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Breadcrumbs,
  Tooltip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Fingerprint as AttendanceIcon,
  AssignmentTurnedIn as DeploymentIcon,
  Security as PostsIcon,
  PhonelinkSetup as DevicesIcon,
  Warning as AlertsIcon,
  Assessment as ReportsIcon,
  People as EmployeesIcon,
  Logout as LogoutIcon,
  Shield as ShieldIcon,
  HelpOutline as HelpIcon,
  AccessTime as ShiftIcon,
  AdminPanelSettings as AccessRightsIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'CONTROLROOM', 'USER'], moduleKey: 'dashboard' },
  { text: 'Attendance Log', icon: <AttendanceIcon />, path: '/attendance', roles: ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'CONTROLROOM', 'USER'], moduleKey: 'attendance' },
  { text: 'Post Deployments', icon: <DeploymentIcon />, path: '/deployment', roles: ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'CONTROLROOM', 'USER'], moduleKey: 'deployment' },
  { text: 'Security Duty Posts', icon: <PostsIcon />, path: '/posts', roles: ['SUPERADMIN', 'ADMIN', 'SUPERVISOR'], moduleKey: 'posts' },
  { text: 'Biometric Devices', icon: <DevicesIcon />, path: '/devices', roles: ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'CONTROLROOM'], moduleKey: 'devices' },
  { text: 'Alert Center', icon: <AlertsIcon />, path: '/alerts', roles: ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'CONTROLROOM'], moduleKey: 'alerts' },
  { text: 'System Reports', icon: <ReportsIcon />, path: '/reports', roles: ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'CONTROLROOM'], moduleKey: 'reports' },
  { text: 'Shift Master', icon: <ShiftIcon />, path: '/shifts', roles: ['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'CONTROLROOM', 'USER'], moduleKey: 'shifts' },
  { text: 'Employees', icon: <EmployeesIcon />, path: '/employees', roles: ['SUPERADMIN', 'ADMIN'], moduleKey: 'employees' },
  { text: 'Access Rights', icon: <AccessRightsIcon />, path: '/access-rights', roles: ['SUPERADMIN'], moduleKey: 'access-rights' },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const { guideMode, toggleGuideMode } = useGuide();
  const { hasPageAccess } = useAccessRights();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;
  const pathNames = currentPath.split('/').filter((x) => x);
  const userRole = user?.role || user?.SecurityRole || 'USER';

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#090d16' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
          <ShieldIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.2 }}>
            SPPAS
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            Security Allocation System
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
        {menuItems.map((item) => {
          if (item.roles && !item.roles.includes(userRole)) return null;
          if (item.moduleKey && !hasPageAccess(item.moduleKey)) return null;
          const isSelected = currentPath === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': { color: '#ffffff' },
                  },
                  '&:hover': {
                    backgroundColor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: isSelected ? '#ffffff' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isSelected ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#111827' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontSize: '0.9rem' }}>
            {(user?.firstName || user?.FirstName)?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, noWrap: true, color: '#f8fafc' }}>
              {user?.firstName || user?.FirstName} {user?.lastName || user?.LastName}
            </Typography>
            <Chip label={userRole} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', mt: 0.2 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19' }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'rgba(17, 24, 39, 0.8)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Breadcrumbs sx={{ flexGrow: 1, color: 'text.secondary' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.875rem' }}>
              Home
            </Link>
            {pathNames.map((name, idx) => (
              <Typography key={idx} sx={{ color: '#f8fafc', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                {name.replace('-', ' ')}
              </Typography>
            ))}
          </Breadcrumbs>

          {/* Module Guide Info Switch */}
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Toggle contextual guide banners across pages">
              <FormControlLabel
                control={
                  <Switch
                    checked={guideMode}
                    onChange={toggleGuideMode}
                    color="secondary"
                    size="small"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <HelpIcon sx={{ fontSize: 16, color: guideMode ? 'secondary.main' : 'text.secondary' }} />
                    <Typography variant="caption" sx={{ color: guideMode ? '#f8fafc' : 'text.secondary', fontWeight: guideMode ? 600 : 400 }}>
                      Guide Info {guideMode ? 'ON' : 'OFF'}
                    </Typography>
                  </Box>
                }
              />
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.85rem' }}>
                {(user?.firstName || user?.FirstName)?.[0] || 'U'}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem disabled sx={{ fontSize: '0.85rem' }}>
                Emp No: {user?.empNo || user?.EmpNo}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawers */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(255,255,255,0.08)' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Viewport */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: '#0b0f19',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
