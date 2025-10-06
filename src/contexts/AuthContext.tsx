"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from '@/types/auth';

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  
  // Actions (delegated to hooks)
  login: (credentials: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Export useAuth directly from this file for backward compatibility
export function useAuth(): AuthContextType {
  return useAuthContext();
}

// Default export
export default useAuth;