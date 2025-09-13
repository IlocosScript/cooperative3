# Shared API Client Configuration

This document describes the centralized API client configuration that provides a consistent way to handle HTTP requests across all API services in the application.

## Overview

The shared API client configuration centralizes:
- API base URL management
- Authentication token handling
- Request/response interceptors
- Error handling
- Retry mechanisms
- Different client configurations for different use cases

## Files Created

1. **`lib/config/apiClient.ts`** - Main shared API client configuration
2. **`lib/config/apiClient.example.ts`** - Usage examples and patterns
3. **`SHARED_API_CLIENT.md`** - This documentation

## Files Updated

1. **`lib/services/membersApi.ts`** - Updated to use shared configuration
2. **`lib/services/fileUploadApi.ts`** - Updated to use shared configuration

## Configuration

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Default Configuration
```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  TIMEOUT: 10000, // 10 seconds default timeout
  UPLOAD_TIMEOUT: 30000, // 30 seconds for file uploads
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;
```

## Available Clients

### 1. Default API Client (`apiClient`)
- **Purpose**: Regular API calls
- **Timeout**: 10 seconds
- **Use Case**: CRUD operations, data fetching

```typescript
import { apiClient } from '@/lib/config/apiClient';

const response = await apiClient.get('/api/members');
```

### 2. Upload Client (`uploadClient`)
- **Purpose**: File uploads
- **Timeout**: 30 seconds
- **Use Case**: File uploads, large data transfers

```typescript
import { uploadClient } from '@/lib/config/apiClient';

const response = await uploadClient.post('/api/upload', formData);
```

### 3. Custom Client (`createCustomApiClient`)
- **Purpose**: Specialized configurations
- **Timeout**: Configurable
- **Use Case**: Custom headers, specific timeouts

```typescript
import { createCustomApiClient } from '@/lib/config/apiClient';

const customClient = createCustomApiClient({
  timeout: 5000,
  headers: { 'X-Custom-Header': 'value' }
});
```

## Features

### 1. Automatic Authentication
All clients automatically include authentication tokens:

```typescript
// Automatically adds: Authorization: Bearer <token>
const response = await apiClient.get('/api/protected-endpoint');
```

### 2. Request Interceptors
- Adds authentication tokens
- Sets common headers
- Logs requests (in development)

### 3. Response Interceptors
- Handles common error scenarios
- Logs errors
- Manages authentication failures

### 4. Error Handling
Centralized error handling with user-friendly messages:

```typescript
import { handleApiError } from '@/lib/config/apiClient';

try {
  const response = await apiClient.get('/api/data');
} catch (error) {
  const userFriendlyError = handleApiError(error);
  console.error(userFriendlyError);
}
```

### 5. Response Handling
Consistent response handling for API responses:

```typescript
import { handleApiResponse } from '@/lib/config/apiClient';

const response = await apiClient.get<{
  success: boolean;
  data: any;
  message: string;
}>('/api/data');

const data = handleApiResponse(response); // Returns response.data.data
```

### 6. Retry Mechanism
Automatic retry for failed requests:

```typescript
import { retryRequest } from '@/lib/config/apiClient';

const result = await retryRequest(
  () => apiClient.get('/api/unreliable-endpoint'),
  3, // max attempts
  1000 // delay in ms
);
```

## Usage Examples

### Basic API Call
```typescript
import { apiClient } from '@/lib/config/apiClient';

export async function getMembers() {
  try {
    const response = await apiClient.get('/api/members');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
```

### File Upload
```typescript
import { uploadClient } from '@/lib/config/apiClient';

export async function uploadFile(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await uploadClient.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
```

### Service Class Pattern
```typescript
import { apiClient, handleApiResponse, handleApiError } from '@/lib/config/apiClient';

export class MembersApiService {
  static async getMembers() {
    try {
      const response = await apiClient.get('/api/members');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  static async createMember(memberData: any) {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: any;
        message: string;
      }>('/api/members', memberData);
      
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}
```

### React Hook Pattern
```typescript
import { useState, useEffect } from 'react';
import { apiClient, handleApiError } from '@/lib/config/apiClient';

export function useApiData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get(endpoint);
        setData(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}
```

## Error Handling

### Automatic Error Handling
The interceptors automatically handle:
- **401 Unauthorized**: Removes auth token, can trigger logout
- **403 Forbidden**: Logs access denied
- **500+ Server Errors**: Logs server errors
- **Network Errors**: Handles connection issues

### Custom Error Handling
```typescript
import { handleApiError } from '@/lib/config/apiClient';

try {
  const response = await apiClient.get('/api/data');
} catch (error) {
  const errorMessage = handleApiError(error);
  // errorMessage is user-friendly and ready to display
  toast.error(errorMessage);
}
```

## Migration Guide

### Before (Old Pattern)
```typescript
// Old way - each service had its own axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 10000,
});

// Manual token handling
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manual error handling
try {
  const response = await apiClient.get('/api/data');
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || 'Failed to fetch data');
  }
  throw new Error('An unexpected error occurred');
}
```

### After (New Pattern)
```typescript
// New way - use shared configuration
import { apiClient, handleApiError } from '@/lib/config/apiClient';

try {
  const response = await apiClient.get('/api/data');
  return response.data;
} catch (error) {
  throw new Error(handleApiError(error));
}
```

## Benefits

1. **Centralized Configuration**: Single source of truth for API settings
2. **Consistent Authentication**: Automatic token handling across all services
3. **Unified Error Handling**: Consistent error messages and handling
4. **Reduced Code Duplication**: No need to repeat axios configuration
5. **Easy Maintenance**: Changes to API configuration affect all services
6. **Better Testing**: Centralized configuration makes mocking easier
7. **Type Safety**: Consistent TypeScript interfaces
8. **Retry Logic**: Built-in retry mechanism for unreliable endpoints

## Best Practices

1. **Use the appropriate client** for your use case:
   - `apiClient` for regular API calls
   - `uploadClient` for file uploads
   - `createCustomApiClient` for special cases

2. **Always use error handling utilities**:
   - `handleApiError()` for consistent error messages
   - `handleApiResponse()` for API responses with success/data/message format

3. **Leverage retry mechanism** for unreliable endpoints:
   - Use `retryRequest()` for endpoints that might fail temporarily

4. **Keep services focused**:
   - Each service should handle one domain (members, files, etc.)
   - Use the shared configuration instead of creating new axios instances

5. **Environment configuration**:
   - Set `NEXT_PUBLIC_API_URL` in your environment variables
   - Use different URLs for development, staging, and production

## Troubleshooting

### Common Issues

1. **Authentication not working**:
   - Check if `auth-token` is stored in localStorage
   - Verify the token format (should be a valid JWT)

2. **Timeout errors**:
   - Use `uploadClient` for file uploads
   - Create custom client with longer timeout for specific endpoints

3. **CORS issues**:
   - Ensure API server allows requests from your domain
   - Check if preflight requests are handled correctly

4. **Environment variables not loading**:
   - Ensure `NEXT_PUBLIC_API_URL` is set correctly
   - Restart development server after changing environment variables

## Future Enhancements

1. **Request/Response Logging**: Enhanced logging for debugging
2. **Caching**: Built-in response caching
3. **Offline Support**: Handle offline scenarios
4. **Request Queuing**: Queue requests when offline
5. **Metrics**: Track API performance and errors
6. **Circuit Breaker**: Prevent cascading failures

## Conclusion

The shared API client configuration provides a robust, maintainable foundation for all API interactions in the application. It eliminates code duplication, ensures consistency, and provides powerful features like automatic authentication, error handling, and retry mechanisms.

By using this configuration, developers can focus on business logic rather than HTTP client setup, leading to more reliable and maintainable code.
