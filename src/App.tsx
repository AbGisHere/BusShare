import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PassengerDashboard } from './pages/PassengerDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const roleDest = (role: string) =>
  role === 'driver' ? '/driver' : role === 'admin' ? '/admin' : '/passenger';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          !loading && user
            ? <Navigate to={roleDest(user.role)} replace />
            : <LandingPage />
        }
      />
      <Route
        path="/login"
        element={
          !loading && user
            ? <Navigate to={roleDest(user.role)} replace />
            : <LoginPage />
        }
      />
      <Route
        path="/register"
        element={
          !loading && user
            ? <Navigate to={roleDest(user.role)} replace />
            : <RegisterPage />
        }
      />

      {/* Protected */}
      <Route
        path="/passenger"
        element={
          <ProtectedRoute user={user} loading={loading} allowedRoles={['passenger']}>
            <PassengerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver"
        element={
          <ProtectedRoute user={user} loading={loading} allowedRoles={['driver']}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute user={user} loading={loading} allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
