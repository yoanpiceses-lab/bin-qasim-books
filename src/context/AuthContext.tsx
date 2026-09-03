import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { api } from '../services/api';
import { supabase } from '../../lib/supabaseClient';

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  login: (
    credentialsOrUsername: { username: string; password: string } | string,
    passwordParam?: string
  ) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateCurrentAdminUser: (user: AdminUser, token?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'binqasim_admin_token';
const USER_KEY = 'binqasim_admin_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setAdminUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Keep the existing API layer compatible while we finish migration.
      localStorage.setItem(TOKEN_KEY, session.access_token);

      const { user } = await api.getAdminMe();

      setAdminUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.warn('Admin session validation failed or expired:', err);

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setAdminUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        localStorage.setItem(TOKEN_KEY, session.access_token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setAdminUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    credentialsOrUsername: { username: string; password: string } | string,
    passwordParam?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    let username = '';
    let password = '';

    if (typeof credentialsOrUsername === 'object' && credentialsOrUsername !== null) {
      username = credentialsOrUsername.username || '';
      password = credentialsOrUsername.password || '';
    } else {
      username = String(credentialsOrUsername || '');
      password = String(passwordParam || '');
    }

    try {
      const res = await api.adminLogin({
        username,
        password,
      });

      if (!res || !res.token || !res.user) {
        throw new Error('Unexpected response format from authentication server');
      }

      // Store the Supabase access token temporarily under the existing key.
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));

      setAdminUser(res.user);
      setIsAuthenticated(true);
      setError(null);

      // The login endpoint authenticated with Supabase on the server.
      // Restore the Supabase client session in the browser so Supabase
      // becomes the actual frontend authentication source.
      if (res.refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: res.token,
          refresh_token: res.refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }
      }

      return true;
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      setIsAuthenticated(false);
      setAdminUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    void supabase.auth.signOut();

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setAdminUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const updateCurrentAdminUser = (user: AdminUser, token?: string) => {
    setAdminUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        isLoading,
        error,
        login,
        logout,
        checkAuth,
        updateCurrentAdminUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};