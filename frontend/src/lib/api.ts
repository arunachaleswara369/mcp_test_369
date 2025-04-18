import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        
        if (response.data.access) {
          // Update token in localStorage
          localStorage.setItem('token', response.data.access);
          
          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          } else {
            originalRequest.headers = {
              Authorization: `Bearer ${response.data.access}`,
            };
          }
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic API request function
const apiRequest = async <T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    let response: AxiosResponse;
    
    switch (method.toLowerCase()) {
      case 'get':
        response = await apiClient.get(url, config);
        break;
      case 'post':
        response = await apiClient.post(url, data, config);
        break;
      case 'put':
        response = await apiClient.put(url, data, config);
        break;
      case 'patch':
        response = await apiClient.patch(url, data, config);
        break;
      case 'delete':
        response = await apiClient.delete(url, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle API errors
      const errorMessage = error.response?.data?.detail || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Export API methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>('get', url, undefined, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('post', url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('put', url, data, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>('patch', url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>('delete', url, config),
};

export default api;