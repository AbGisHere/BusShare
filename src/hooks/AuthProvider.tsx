import React from 'react';
import { AuthContext, useAuthState } from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useAuthState();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
