import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  TIMEOUT: 10000, // 10 seconds default timeout
  UPLOAD_TIMEOUT: 30000, // 30 seconds for file uploads
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Request interceptor for adding auth tokens and common headers
const requestInterceptor = (config: AxiosRequestConfig) => {
  // Add auth token if available
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // Add common headers only if not FormData (FormData needs its own Content-Type)
  if (!(config.data instanceof FormData)) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    };
  }

  return config;
};

// Response interceptor for error handling
const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

const responseErrorInterceptor = (error: any) => {
  console.error('API Error:', error);
  
  // Handle common error scenarios
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login or refresh token
    localStorage.removeItem('auth-token');
    // You can dispatch a logout action here if using Redux/Context
  }
  
  if (error.response?.status === 403) {
    // Forbidden - user doesn't have permission
    console.error('Access forbidden');
  }
  
  if (error.response?.status >= 500) {
    // Server error
    console.error('Server error occurred');
  }
  
  return Promise.reject(error);
};

// Create base axios instance
const createApiClient = (timeout: number = API_CONFIG.TIMEOUT): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout,
    // Don't set default Content-Type here - let the interceptor handle it
  });

  // Add request interceptor
  client.interceptors.request.use(requestInterceptor, (error) => {
    return Promise.reject(error);
  });

  // Add response interceptor
  client.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

  return client;
};

// Create different axios instances for different use cases
export const apiClient = createApiClient(); // Default client for regular API calls
export const uploadClient = createApiClient(API_CONFIG.UPLOAD_TIMEOUT); // Client for file uploads

// Utility function to create a custom client with specific configuration
export const createCustomApiClient = (config: Partial<AxiosRequestConfig> = {}): AxiosInstance => {
  const customClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    // Don't set default Content-Type here - let the interceptor handle it
    ...config,
  });

  // Add interceptors
  customClient.interceptors.request.use(requestInterceptor, (error) => {
    return Promise.reject(error);
  });

  customClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

  return customClient;
};

// Retry mechanism for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxAttempts: number = API_CONFIG.RETRY_ATTEMPTS,
  delay: number = API_CONFIG.RETRY_DELAY
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          throw error; // Don't retry authentication/authorization errors
        }
      }

      if (attempt < maxAttempts) {
        console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
};

// Utility function to handle API responses consistently
export const handleApiResponse = <T>(response: AxiosResponse<{ success: boolean; data: T; message: string }>): T => {
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'API request failed');
  }
};

// Utility function to handle API errors consistently
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    return message || 'An unexpected error occurred';
  }
  return error.message || 'An unexpected error occurred';
};

// Export the API base URL for use in other parts of the application
export const API_BASE_URL = API_CONFIG.BASE_URL;

// Export default apiClient for backward compatibility
export default apiClient;
