import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, avatar?: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (name?: string, avatar?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const fetchProfile = async () => {
    const token = localStorage.getItem('mumbai_ganpati_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const u = await api.getProfile();
      setUser(u);
    } catch (err) {
      console.warn('Failed to load profile:', err);
      localStorage.removeItem('mumbai_ganpati_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(email, pass);
      localStorage.setItem('mumbai_ganpati_token', res.token);
      setUser(res.user);
      showToast(`Welcome back, ${res.user.name}! 🌺`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string, avatar?: string): Promise<boolean> => {
    try {
      const res = await api.register(name, email, pass, avatar);
      localStorage.setItem('mumbai_ganpati_token', res.token);
      setUser(res.user);
      showToast(`Account created! Welcome to Ganpati Explorer 🪔`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mumbai_ganpati_token');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const updated = await api.getProfile();
      setUser(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (name?: string, avatar?: string) => {
    try {
      const updated = await api.updateProfile(name, avatar);
      setUser(updated);
      showToast('Profile updated successfully! ✨', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
