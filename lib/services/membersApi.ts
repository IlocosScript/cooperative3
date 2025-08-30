import axios from 'axios';
import { Member, MemberApiResponse, MembersResponse, MembersQueryParams, ApiError } from '../types/members';

// Interface for the create member request payload
interface CreateMemberRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  birthplace?: string;
  genderType: number;
  civilStatus: number;
  tin?: string;
  bodNumber?: string;
  status: number;
  membershipType: number;
  membershipDate: string;
  terminationDate?: string;
  notes?: string;
  addresses: Array<{
    addressType: number;
    streetAddress1: string;
    streetAddress2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    isPrimary: boolean;
    isCurrent: boolean;
    notes?: string;
  }>;
  contactNumbers: Array<{
    phoneNumber: string;
    isPrimary: boolean;
  }>;
  dependents: Array<{
    firstName: string;
    lastName: string;
    middleName?: string;
    relationship: number;
    dateOfBirth: string;
    genderType: number;
    address?: string;
    isDependent: boolean;
    isBeneficiary: boolean;
    benefitTypes: number[];
  }>;
  educations: Array<{
    educationAttainmentType: number;
    schoolName: string;
    course?: string;
    yearCompleted: number;
    yearStarted: number;
    isHighestAttainment: boolean;
    notes?: string;
  }>;
  incomes: Array<{
    source: string;
    incomeAmount: number;
    isPrimary: boolean;
  }>;
}

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
  static async getMember(id: number): Promise<MemberApiResponse> {
    try {
      const response = await apiClient.get<{ success: boolean; data: MemberApiResponse; message: string }>(
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
  static async createMember(memberData: CreateMemberRequest, files?: File[]): Promise<Member> {
    try {
      let response;
      
      if (files && files.length > 0) {
        // Use multipart/form-data for file uploads
        const formData = new FormData();
        formData.append('memberData', JSON.stringify(memberData));
        
        files.forEach((file) => {
          formData.append('files', file);
        });
        
        response = await apiClient.post<{ success: boolean; data: Member; message: string }>(
          '/api/members',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Use JSON for requests without files
        response = await apiClient.post<{ success: boolean; data: Member; message: string }>(
          '/api/members',
          memberData
        );
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to create member';
        const errors = error.response?.data?.errors || [];
        throw new Error(errors.length > 0 ? errors.join(', ') : errorMessage);
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Update an existing member
   */
  static async updateMember(id: number, memberData: any): Promise<MemberApiResponse> {
    try {
      console.log('API Service - Update request for member ID:', id);
      console.log('API Service - Update payload:', memberData);
      
      const response = await apiClient.put<{ success: boolean; data: MemberApiResponse; message: string }>(
        `/api/members/${id}`,
        memberData
      );
      
      console.log('API Service - Update response:', response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('API Service - Update error:', error.response?.data);
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
