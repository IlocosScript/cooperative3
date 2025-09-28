import axios from 'axios';
import { apiClient, handleApiResponse, handleApiError } from '../config/apiClient';
import { Member, MemberApiResponse, MembersResponse, MembersQueryParams, ApiError, CreateMemberRequest } from '../dto/member.dto';


// Using shared apiClient from config

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
      
      
      const response = await apiClient.get<MembersResponse>('/api/members', {
        params: requestParams,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
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
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new member
   */
  static async createMember(memberData: CreateMemberRequest): Promise<Member> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Member; message: string }>(
        '/api/members',
        memberData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      return handleApiResponse(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to create member';
        const errors = error.response?.data?.errors || [];
        throw new Error(errors.length > 0 ? errors.join(', ') : errorMessage);
      }
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update an existing member
   */
  static async updateMember(id: number, memberData: any): Promise<MemberApiResponse> {
    try {
      
      const response = await apiClient.put<{ success: boolean; data: MemberApiResponse; message: string }>(
        `/api/members/${id}`,
        memberData
      );
      
      return handleApiResponse(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update member');
      }
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete a member
   */
  static async deleteMember(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/members/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
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
