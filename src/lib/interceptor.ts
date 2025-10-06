import axios, { AxiosInstance, AxiosResponse, AxiosError,InternalAxiosRequestConfig } from 'axios';
import  env  from '@/config/env';

declare module "axios" {
    export interface AxiosRequestConfig {
        metadata?: { 
            startTime?: number 
        };
    }
}

// Types for better type safety
interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresIn?: number;
}

interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Token management utilities
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'authToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';
  
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  
  static setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    
    if (tokens.expiresIn) {
      const expiryTime = Date.now() + (tokens.expiresIn * 1000);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  }
  
  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }
  
  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;
    
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return false;
    
    return Date.now() > parseInt(expiryTime);
  }
  
  static getTokenExpiry(): Date | null {
    if (typeof window === 'undefined') return null;
    
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    return expiryTime ? new Date(parseInt(expiryTime)) : null;
  }
}

// Auth service interface
interface AuthService {
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
  logout(): Promise<void>;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request queue for handling concurrent requests during token refresh
interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: InternalAxiosRequestConfig;
}

class RequestQueue {
  private static isRefreshing = false;
  private static failedQueue: QueuedRequest[] = [];
  
  static processQueue(error: AxiosError | null, token: string | null = null): void {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        resolve(apiClient(config));
      }
    });
    
    this.failedQueue = [];
    this.isRefreshing = false;
  }
  
  static addToQueue(config: InternalAxiosRequestConfig): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject, config });
    });
  }
  
  static get isRefreshingToken(): boolean {
    return this.isRefreshing;
  }
  
  static set isRefreshingToken(value: boolean) {
    this.isRefreshing = value;
  }
}

// Auth service instance (will be injected)
let authServiceInstance: AuthService | null = null;

// Function to set auth service
export const setAuthService = (authService: AuthService): void => {
  authServiceInstance = authService;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request timestamp for debugging
    config.metadata = { 
        ...config.metadata, 
        startTime: Date.now() 
    };
    
    // Add auth token if available
    const token = TokenManager.getAccessToken();
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add trace ID for audit logging
    const traceId = generateTraceId();
    config.headers['X-Trace-ID'] = traceId;
    
    // Add client info
    config.headers['X-Client-Version'] = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
    config.headers['X-Client-Platform'] = 'web';
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(createApiError(error));
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Add response time for performance monitoring
    if (response.config.metadata?.startTime) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.debug(`API call to ${response.config.url} took ${duration}ms`);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle different error types
    if (!error.response) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject(createApiError(error, 'Network error. Please check your connection.'));
    }
    
    const { status } = error.response;
    
    // Handle 401 Unauthorized - Token refresh logic
    if (status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      
      // If already refreshing, add to queue
      if (RequestQueue.isRefreshingToken) {
        return RequestQueue.addToQueue(originalRequest);
      }
      
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        // No refresh token available, redirect to login
        handleAuthFailure();
        return Promise.reject(createApiError(error, 'Authentication required'));
      }
      
      RequestQueue.isRefreshingToken = true;
      
      try {
        if (!authServiceInstance) {
          throw new Error('Auth service not initialized');
        }
        
        const response = await authServiceInstance.refreshToken(refreshToken);
        
        // Update tokens
        TokenManager.setTokens({
          token: response.token,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn
        });
        
        // Update default header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        
        // Process queued requests
        RequestQueue.processQueue(null, response.token);
        
        // Retry original request
        originalRequest.headers['Authorization'] = `Bearer ${response.token}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, handle auth failure
        console.error('Token refresh failed:', refreshError);
        RequestQueue.processQueue(refreshError as AxiosError, null);
        handleAuthFailure();
        return Promise.reject(createApiError(error, 'Session expired. Please login again.'));
      }
    }
    
    // Handle other status codes
    switch (status) {
      case 403:
        console.error('Access forbidden:', error.response.data);
        return Promise.reject(createApiError(error, 'You do not have permission to perform this action.'));
        
      case 404:
        console.error('Resource not found:', error.response.data);
        return Promise.reject(createApiError(error, 'The requested resource was not found.'));
        
      case 422:
        console.error('Validation error:', error.response.data);
        return Promise.reject(createApiError(error, 'Validation failed. Please check your input.'));
        
      case 429:
        console.error('Rate limit exceeded:', error.response.data);
        return Promise.reject(createApiError(error, 'Too many requests. Please try again later.'));
        
      case 500:
      case 502:
      case 503:
      case 504:
        console.error('Server error:', error.response.data);
        return Promise.reject(createApiError(error, 'Server error. Please try again later.'));
        
      default:
        console.error('API error:', error.response.data);
        return Promise.reject(createApiError(error));
    }
  }
);

// Utility functions
function generateTraceId(): string {
  return 'trace-' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function createApiError(error: AxiosError, customMessage?: string): ApiError {
  const apiError: ApiError = {
    message: customMessage || error.message || 'An unexpected error occurred',
    status: error.response?.status,
    code: error.code,
    details: error.response?.data
  };
  
  return apiError;
}

function handleAuthFailure(): void {
  // Clear tokens
  TokenManager.clearTokens();
  
  // Clear axios default header
  delete apiClient.defaults.headers.common['Authorization'];
  
  // Redirect to login page (only in browser)
  if (typeof window !== 'undefined') {
    // Dispatch custom event for auth failure
    window.dispatchEvent(new CustomEvent('auth:failure'));
    
    // Redirect to login if not already there
    if (!window.location.pathname.includes('/login')) {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }
  }
}

// Helper functions for token management
export const tokenUtils = {
  isAuthenticated: (): boolean => {
    return !!TokenManager.getAccessToken();
  },
  
  isTokenExpired: (): boolean => {
    return TokenManager.isTokenExpired();
  },
  
  getTokenExpiry: (): Date | null => {
    return TokenManager.getTokenExpiry();
  },
  
  clearTokens: (): void => {
    TokenManager.clearTokens();
    delete apiClient.defaults.headers.common['Authorization'];
  },
  
  setTokens: (tokens: AuthTokens): void => {
    TokenManager.setTokens(tokens);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.token}`;
  }
};

// Request/Response logging for development
if (process.env.NODE_ENV === 'development') {
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Config:', config);
      console.groupEnd();
      return config;
    }
  );
  
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      console.group(`✅ API Response: ${response.status} ${response.config.url}`);
      console.log('Response:', response.data);
      console.groupEnd();
      return response;
    },
    (error: AxiosError) => {
      console.group(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
      console.error('Error:', error.response?.data || error.message);
      console.groupEnd();
      return Promise.reject(error);
    }
  );
}

// Export the configured axios instance
export default apiClient;

// Export types for use in other files
export type { AuthTokens, ApiError, RefreshTokenResponse };