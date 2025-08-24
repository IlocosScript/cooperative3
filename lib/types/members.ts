// Member DTOs for API integration

export interface Member {
  Id: number;
  MemberNumber: string;
  FirstName: string;
  LastName: string;
  MiddleName: string | null;
  DateOfBirth: string;
  GenderType: number;
  CivilStatus: number;
  Status: number;
  MembershipType: number;
  CreatedAt: string;
  FullName: string;
  Age: number;
  PrimaryAddress: string;
  PrimaryContactNumber: string;
}

export interface MembersResponse {
  success: boolean;
  data: {
    items: Member[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    success: boolean;
    message: string;
  };
  message: string;
}

export interface MembersQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: number;
  membershipType?: number;
  sortBy?: 'firstName' | 'lastName' | 'memberNumber' | 'dateOfBirth' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Status and type enums for better type safety
export enum MemberStatus {
  PendingStatus = 0,
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Pending = 4,
  Terminated = 5,
  OnHold = 6,
  Probationary = 7,
  Honorary = 8,
  Deceased = 9,
  Other = 99
}

export enum MembershipType {
  Member = 1
}

export enum GenderType {
  Male = 1,
  Female = 2,
  NonBinary = 3,
  PreferNotToSay = 4,
  Other = 5
}

export enum CivilStatus {
  Single = 1,
  Married = 2,
  Widowed = 3,
  Divorced = 4,
  Separated = 5,
  DomesticPartnership = 6,
  Annulled = 7,
  Other = 99
}

// Helper functions for status display
export const getStatusLabel = (status: number): string => {
  switch (status) {
    case MemberStatus.PendingStatus:
      return 'Pending Status';
    case MemberStatus.Active:
      return 'Active';
    case MemberStatus.Inactive:
      return 'Inactive';
    case MemberStatus.Suspended:
      return 'Suspended';
    case MemberStatus.Pending:
      return 'Pending';
    case MemberStatus.Terminated:
      return 'Terminated';
    case MemberStatus.OnHold:
      return 'On Hold';
    case MemberStatus.Probationary:
      return 'Probationary';
    case MemberStatus.Honorary:
      return 'Honorary';
    case MemberStatus.Deceased:
      return 'Deceased';
    case MemberStatus.Other:
      return 'Other';
    default:
      return 'Unknown';
  }
};

export const getStatusVariant = (status: number): 'default' | 'secondary' | 'destructive' => {
  switch (status) {
    case MemberStatus.Active:
      return 'default';
    case MemberStatus.Inactive:
    case MemberStatus.PendingStatus:
    case MemberStatus.Pending:
    case MemberStatus.Probationary:
      return 'secondary';
    case MemberStatus.Suspended:
    case MemberStatus.Terminated:
    case MemberStatus.OnHold:
    case MemberStatus.Deceased:
      return 'destructive';
    case MemberStatus.Honorary:
      return 'default';
    default:
      return 'secondary';
  }
};

export const getMembershipTypeLabel = (type: number): string => {
  switch (type) {
    case MembershipType.Member:
      return 'Member';
    default:
      return 'Unknown';
  }
};

export const getGenderLabel = (gender: number): string => {
  switch (gender) {
    case GenderType.Male:
      return 'Male';
    case GenderType.Female:
      return 'Female';
    case GenderType.NonBinary:
      return 'Non-Binary';
    case GenderType.PreferNotToSay:
      return 'Prefer Not to Say';
    case GenderType.Other:
      return 'Other';
    default:
      return 'Unknown';
  }
};

export const getCivilStatusLabel = (status: number): string => {
  switch (status) {
    case CivilStatus.Single:
      return 'Single';
    case CivilStatus.Married:
      return 'Married';
    case CivilStatus.Widowed:
      return 'Widowed';
    case CivilStatus.Divorced:
      return 'Divorced';
    case CivilStatus.Separated:
      return 'Separated';
    case CivilStatus.DomesticPartnership:
      return 'Domestic Partnership';
    case CivilStatus.Annulled:
      return 'Annulled';
    case CivilStatus.Other:
      return 'Other';
    default:
      return 'Unknown';
  }
};
