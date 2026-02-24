<<<<<<< HEAD
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User } from '../types';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState>({
  user: null, token: null, loading: true,
  login: () => {}, logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const useAuthState = () => {
  const [state, setState] = useState<{ user: User | null; token: string | null; loading: boolean }>(
    { user: null, token: null, loading: true }
  );
=======
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });
>>>>>>> a4055be (V2.1.1 : Fronted changes)

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
<<<<<<< HEAD
        setState({ user: JSON.parse(userStr) as User, token, loading: false });
=======
        const user: User = JSON.parse(userStr);
        setState({ user, token, loading: false });
>>>>>>> a4055be (V2.1.1 : Fronted changes)
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({ user: null, token: null, loading: false });
      }
    } else {
      setState({ user: null, token: null, loading: false });
    }
  }, []);

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({ user, token, loading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({ user: null, token: null, loading: false });
  }, []);

  return { ...state, login, logout };
};
