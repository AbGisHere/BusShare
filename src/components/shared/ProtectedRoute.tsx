import React from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../../types';

interface Props {
  user: User | null;
  loading: boolean;
  allowedRoles?: string[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ user, loading, allowedRoles, children }) => {
  if (loading) {
    return (
<<<<<<< HEAD
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#01161E' }}>
=======
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#01161E',
      }}>
>>>>>>> a4055be (V2.1.1 : Fronted changes)
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dest = user.role === 'passenger' ? '/passenger' : user.role === 'driver' ? '/driver' : '/admin';
    return <Navigate to={dest} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
