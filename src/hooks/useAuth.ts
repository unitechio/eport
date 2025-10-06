import { useContext } from 'react';
import { AuthContext, useAuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/contexts/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useAuthContext();
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
