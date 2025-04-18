import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  bio?: string;
  date_joined: string;
}

// Authentication service
const authService = {
  // Login user and store tokens
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post<AuthTokens>('/auth/token/', credentials);
    
    // Store tokens in localStorage
    localStorage.setItem('token', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    
    // Get user profile
    return authService.getCurrentUser();
  },
  
  // Register new user
  register: async (data: RegistrationData): Promise<User> => {
    const response = await api.post<User>('/users/', data);
    
    // After registration, login the user
    await authService.login({
      email: data.email,
      password: data.password,
    });
    
    return response;
  },
  
  // Logout user
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/users/me/');
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  // Change password
  changePassword: async (oldPassword: string, newPassword: string, newPasswordConfirm: string): Promise<void> => {
    await api.put('/users/change_password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
  },
  
  // Update user profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    return api.put<User>('/users/update_profile/', profileData);
  },
  
  // Verify token
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      await api.post('/auth/token/verify/', { token });
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Refresh token
  refreshToken: async (): Promise<AuthTokens> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post<AuthTokens>('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    
    localStorage.setItem('token', response.access);
    return response;
  },
};

export default authService;