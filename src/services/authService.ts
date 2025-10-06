import apiClient, { tokenUtils } from '@/lib/interceptor';
import type { LoginCredentials, User, AuthResponse, Role, Permission } from '@/types/auth';

export class AuthService {
  // BYPASS MODE - Set to true for testing
  private readonly BYPASS_MODE = process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_AUTH_BYPASS === 'true';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Simulating login...', credentials);
      console.log(credentials.email)

      if (!credentials || !credentials.email) {
        throw new Error('Email is required');
      }

      const email = credentials.email;

      // Simulate different scenarios for testing
      if (email === 'error@test.com') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('Invalid credentials');
      }

      if (email === 'slow@test.com') {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
      }

      const user = this.getMockUser(email);

      const mockAuthData: AuthResponse = {
        user: user,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600 // 1 hour
      };

      tokenUtils.setTokens({
        token: mockAuthData.token,
        refreshToken: mockAuthData.refreshToken,
        expiresIn: mockAuthData.expiresIn
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAuthData;
    }

    // Real API call would go here...
    throw new Error('API mode not implemented');
  }

  // Real API call
  // try {
  //   const response = await apiClient.post('/auth/login', credentials);
  //   const authData = response.data;

  //   tokenUtils.setTokens({
  //     token: authData.token,
  //     refreshToken: authData.refreshToken,
  //     expiresIn: authData.expiresIn
  //   });

  //   return authData;
  // } catch (error) {
  //   console.error('Login failed:', error);
  //   throw error;
  // }


  async logout(): Promise<void> {
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Simulating logout...');
      await new Promise(resolve => setTimeout(resolve, 500));
      tokenUtils.clearTokens();
      return;
    }

    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      tokenUtils.clearTokens();
    }
  }

  async getMe(): Promise<User> {
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Returning mock user...');

      // Get stored email from somewhere or use default
      const mockUser = this.getMockUser('user@test.com');
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUser;
    }

    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Simulating token refresh...');

      const mockAuthData: AuthResponse = {
        user: this.getMockUser('user@test.com'),
        token: 'refreshed-mock-jwt-token-' + Date.now(),
        refreshToken: 'refreshed-mock-refresh-token-' + Date.now(),
        expiresIn: 3600
      };

      await new Promise(resolve => setTimeout(resolve, 800));
      return mockAuthData;
    }

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
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Simulating profile update...', userData);

      const updatedUser = {
        ...this.getMockUser('user@test.com'),
        ...userData
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      return updatedUser;
    }

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
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Simulating password change...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      return;
    }

    try {
      await apiClient.post('/auth/change-password', data);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Simulating password reset for:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    try {
      await apiClient.post('/auth/reset-password', { email });
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  async verifyResetToken(token: string): Promise<boolean> {
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Token verification always returns true');
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }

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
    if (this.BYPASS_MODE) {
      console.log('🧪 BYPASS MODE: Simulating password reset confirmation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    try {
      await apiClient.post('/auth/confirm-reset-password', data);
    } catch (error) {
      console.error('Password reset confirmation failed:', error);
      throw error;
    }
  }

  // Private helper methods for mock data
  private getMockUser(email: string): User {
    if (!email) {
      email = 'user@test.com'; // fallback
    }
    
    return {
      // id: this.getUserId(email),
      id: 'admin-1',
      email: email,
      firstName: 'Admin',
      lastName: 'User',
      username: 'Admin User',
      roles: this.getMockRoles(email),
      permissions: this.getMockUserPermissions(email)
    };
  }

  private getUserId(email: string): string {
    if (!email) return 'user-1';
    if (email.includes('admin')) return 'admin-1';
    if (email.includes('manager')) return 'manager-1';
    return 'user-1';
  }

  private getMockUserName(email: string): string {
    if (!email) return 'Regular User';
    if (email.includes('admin')) return 'Admin User';
    if (email.includes('manager')) return 'Manager User';
    if (email.includes('slow')) return 'Slow Response User';
    if (email.includes('error')) return 'Error User';
    return 'Regular User';
  }
  

  // User permissions as string[] 
  private getMockUserPermissions(email: string): string[] {
    if (email.includes('admin')) {
      return ['read_all', 'write_all', 'admin_access', 'delete_all', 'manage_users'];
    }

    if (email.includes('manager')) {
      return ['read_all', 'write_team', 'manage_team'];
    }

    // Regular user
    return ['read_all', 'write_own'];
  }

  // Role permissions as Permission[] objects
  private getMockRolePermissions(email: string): Permission[] {
    if (email.includes('admin')) {
      return [
        {
          id: '1',
          name: 'read_all',
          resource: 'all',
          action: 'read',
          description: 'Can read all resources'
        },
        {
          id: '2',
          name: 'write_all',
          resource: 'all',
          action: 'write',
          description: 'Can write to all resources'
        },
        {
          id: '3',
          name: 'admin_access',
          resource: 'system',
          action: 'manage',
          description: 'Full administrative access'
        },
        {
          id: '4',
          name: 'delete_all',
          resource: 'all',
          action: 'delete',
          description: 'Can delete any resource'
        }
      ];
    }

    if (email.includes('manager')) {
      return [
        {
          id: '1',
          name: 'read_all',
          resource: 'all',
          action: 'read',
          description: 'Can read all resources'
        },
        {
          id: '5',
          name: 'write_team',
          resource: 'team',
          action: 'write',
          description: 'Can write to team resources'
        },
        {
          id: '6',
          name: 'manage_team',
          resource: 'team',
          action: 'manage',
          description: 'Can manage team members'
        }
      ];
    }

    // Regular user
    return [
      {
        id: '1',
        name: 'read_all',
        resource: 'all',
        action: 'read',
        description: 'Can read all resources'
      },
      {
        id: '7',
        name: 'write_own',
        resource: 'profile',
        action: 'write',
        description: 'Can write to own profile'
      }
    ];
  }

  private getMockRoles(email: string): Role[] {
    const permissions = this.getMockRolePermissions(email);

    if (email.includes('admin')) {
      return [{
        id: '1',
        name: 'admin',
        description: 'System Administrator with full access',
        permissions: permissions
      }];
    }

    if (email.includes('manager')) {
      return [{
        id: '2',
        name: 'manager',
        description: 'Department Manager with team access',
        permissions: permissions
      }];
    }

    return [{
      id: '3',
      name: 'user',
      description: 'Regular User with basic access',
      permissions: permissions
    }];
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

  // Debug helper
  logBypassStatus(): void {
    if (this.BYPASS_MODE) {
      console.log('🧪 AUTH BYPASS MODE ACTIVE');
      console.log('Test accounts:');
      console.log('- admin@test.com (admin role) - Full access');
      console.log('- manager@test.com (manager role) - Team management');
      console.log('- user@test.com (user role) - Basic access');
      console.log('- error@test.com - Simulates login error');
      console.log('- slow@test.com - Simulates slow response (3s)');
      console.log('- Any password works in bypass mode');
    } else {
      console.log('🔐 AUTH REAL API MODE');
    }
  }

  // Method to check current mode
  isBypassMode(): boolean {
    return this.BYPASS_MODE;
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