import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { AuthProvider } from './hooks/AuthProvider';
=======
>>>>>>> a4055be (V2.1.1 : Fronted changes)
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/shared/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PassengerDashboard } from './pages/PassengerDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

<<<<<<< HEAD
const roleDest = (role: string) =>
  role === 'driver' ? '/driver' : role === 'admin' ? '/admin' : '/passenger';

=======
>>>>>>> a4055be (V2.1.1 : Fronted changes)
const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          !loading && user
<<<<<<< HEAD
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
=======
            ? <Navigate to={user.role === 'driver' ? '/driver' : user.role === 'admin' ? '/admin' : '/passenger'} replace />
            : <LandingPage />
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
>>>>>>> a4055be (V2.1.1 : Fronted changes)

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

<<<<<<< HEAD
=======
      {/* Catch-all */}
>>>>>>> a4055be (V2.1.1 : Fronted changes)
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
<<<<<<< HEAD
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
=======
    <AppRoutes />
>>>>>>> a4055be (V2.1.1 : Fronted changes)
  </BrowserRouter>
);

export default App;
