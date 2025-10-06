import apiClient, { tokenUtils } from '@/lib/interceptor'
import type { LoginCredentials, User, AuthResponse } from '@/types/auth';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const authData = response.data;
      
      // Set tokens using utility
      tokenUtils.setTokens({
        token: authData.token,
        refreshToken: authData.refreshToken,
        expiresIn: authData.expiresIn
      });
      
      return authData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API fails
    } finally {
      // Always clear local tokens
      tokenUtils.clearTokens();
    }
  }

  async getMe(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken
      });
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', data);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { email });
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/verify-reset-token', { token });
      return true;
    } catch (error) {
      console.error('Reset token verification failed:', error);
      return false;
    }
  }

  async confirmResetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    try {
      await apiClient.post('/auth/confirm-reset-password', data);
    } catch (error) {
      console.error('Password reset confirmation failed:', error);
      throw error;
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return tokenUtils.isAuthenticated();
  }

  isTokenExpired(): boolean {
    return tokenUtils.isTokenExpired();
  }

  getTokenExpiry(): Date | null {
    return tokenUtils.getTokenExpiry();
  }
}

// Create singleton instance
export const authService = new AuthService();

// Export individual functions for backward compatibility
export const login = (credentials: LoginCredentials) => authService.login(credentials);
export const logout = () => authService.logout();
export const getMe = () => authService.getMe();
export const refreshToken = (token: string) => authService.refreshToken(token);

export default authService;