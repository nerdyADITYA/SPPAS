import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';

import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import { GuideProvider } from './contexts/GuideContext';
import { AccessRightsProvider } from './contexts/AccessRightsContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import DeploymentPage from './pages/DeploymentPage';
import PostsPage from './pages/PostsPage';
import DevicesPage from './pages/DevicesPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import EmployeesPage from './pages/EmployeesPage';
import ShiftMasterPage from './pages/ShiftMasterPage';
import AccessRightsPage from './pages/AccessRightsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <AuthProvider>
            <AccessRightsProvider>
              <GuideProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected App Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route element={<AppLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/attendance" element={<AttendancePage />} />
                        <Route path="/deployment" element={<DeploymentPage />} />
                        <Route path="/posts" element={<PostsPage />} />
                        <Route path="/devices" element={<DevicesPage />} />
                        <Route path="/alerts" element={<AlertsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/shifts" element={<ShiftMasterPage />} />
                        <Route path="/employees" element={<EmployeesPage />} />
                        <Route path="/access-rights" element={<AccessRightsPage />} />
                      </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </BrowserRouter>
              </GuideProvider>
            </AccessRightsProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
