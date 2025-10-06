// src/providers/auth-provider.tsx
"use client";

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { tokenUtils } from '@/lib/interceptor';
import type { User, LoginCredentials } from '@/types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!user && tokenUtils.isAuthenticated();

  // Initialize auth
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (tokenUtils.isAuthenticated() && !tokenUtils.isTokenExpired()) {
        const userData = await authService.getMe();
        setUser(userData);
      } else {
        tokenUtils.clearTokens();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      tokenUtils.clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  // Auth actions
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const authResponse = await authService.login(credentials);
      setUser(authResponse.user);
      return authResponse;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      if (!isAuthenticated) return;
      setIsLoading(true);
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, logout]);

  // Effects
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleAuthFailure = () => {
      setUser(null);
      router.push('/login');
    };

    window.addEventListener('auth:failure', handleAuthFailure);
    return () => window.removeEventListener('auth:failure', handleAuthFailure);
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const validateToken = () => {
      if (tokenUtils.isTokenExpired()) {
        console.warn('Token expired, logging out user');
        logout();
      }
    };

    const interval = setInterval(validateToken, 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  const contextValue = {
    user,
    isLoading,
    isAuthenticated,
    isInitialized,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}