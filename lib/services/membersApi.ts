import axios from 'axios';
import { Member, MembersResponse, MembersQueryParams, ApiError } from '../types/members';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export class MembersApiService {
  /**
   * Get members with pagination and filtering
   */
  static async getMembers(params: MembersQueryParams = {}): Promise<MembersResponse> {
    try {
      const requestParams = {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        ...(params.searchTerm && { searchTerm: params.searchTerm }),
        ...(params.status && { status: params.status }),
        ...(params.membershipType && { membershipType: params.membershipType }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
      };
      
      console.log('API Service - Request params:', requestParams);
      console.log('API Service - Full URL:', `${API_BASE_URL}/api/members`);
      
      const response = await apiClient.get<MembersResponse>('/api/members', {
        params: requestParams,
      });
      
      console.log('API Service - Raw response:', response);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch members');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Get a single member by ID
   */
  static async getMember(id: number): Promise<Member> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Member; message: string }>(
        `/api/members/${id}`
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch member');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Create a new member
   */
  static async createMember(memberData: Partial<Member>): Promise<Member> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Member; message: string }>(
        '/api/members',
        memberData
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create member');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Update an existing member
   */
  static async updateMember(id: number, memberData: Partial<Member>): Promise<Member> {
    try {
      const response = await apiClient.put<{ success: boolean; data: Member; message: string }>(
        `/api/members/${id}`,
        memberData
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update member');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Delete a member
   */
  static async deleteMember(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/members/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to delete member');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Search members by term
   */
  static async searchMembers(searchTerm: string, params: Omit<MembersQueryParams, 'searchTerm'> = {}): Promise<MembersResponse> {
    return this.getMembers({ ...params, searchTerm });
  }

  /**
   * Get members by status
   */
  static async getMembersByStatus(status: number, params: Omit<MembersQueryParams, 'status'> = {}): Promise<MembersResponse> {
    return this.getMembers({ ...params, status });
  }

  /**
   * Get members by membership type
   */
  static async getMembersByType(membershipType: number, params: Omit<MembersQueryParams, 'membershipType'> = {}): Promise<MembersResponse> {
    return this.getMembers({ ...params, membershipType });
  }
}

// Export default instance
export default MembersApiService;
