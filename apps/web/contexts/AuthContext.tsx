'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../lib/graphql/queries';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'CLIENT' | 'FREELANCER';
  isVerified: boolean;
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, adminOnly?: boolean) => Promise<boolean>;
  register: (registerData: RegisterInput) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: User) => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'FREELANCER';
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, adminOnly: boolean = false): Promise<boolean> => {
    try {
      const { data } = await loginMutation({
        variables: {
          loginInput: { email, password }
        }
      });

      if (data?.login) {
        const { accessToken, user: userData } = data.login;

        // Check admin-only restriction for admin panel
        if (adminOnly && userData.role !== 'ADMIN') {
          throw new Error('Access denied. Admin privileges required.');
        }

        setToken(accessToken);
        setUser(userData);

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));

        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (registerData: RegisterInput): Promise<boolean> => {
    try {
      const { data } = await registerMutation({
        variables: {
          registerInput: registerData
        }
      });

      if (data?.register) {
        const { accessToken, user: userData } = data.register;

        setToken(accessToken);
        setUser(userData);

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));

        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
