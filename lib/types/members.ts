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

export enum Gender {
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
    case Gender.Male:
      return 'Male';
    case Gender.Female:
      return 'Female';
    case Gender.NonBinary:
      return 'Non-Binary';
    case Gender.PreferNotToSay:
      return 'Prefer Not to Say';
    case Gender.Other:
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

// Address Type Enum
export enum AddressType {
  Home = 1,
  Work = 2,
  Mailing = 3,
  Billing = 4,
  Permanent = 5,
  Temporary = 6,
  Previous = 7,
  EmergencyContact = 8,
  Other = 99
}

// Relationship Type Enum
export enum RelationshipType {
  Spouse = 1,
  Child = 2,
  Parent = 3,
  Sibling = 4,
  Grandparent = 5,
  Grandchild = 6,
  UncleAunt = 7,
  NieceNephew = 8,
  Cousin = 9,
  StepChild = 10,
  StepParent = 11,
  StepSibling = 12,
  InLaw = 13,
  FosterChild = 14,
  AdoptedChild = 15,
  LegalGuardian = 16,
  Other = 99
}

// Education Attainment Type Enum
export enum EducationAttainmentType {
  NoFormalEducation = 1,
  ElementaryLevel = 2,
  ElementaryGraduate = 3,
  HighSchoolLevel = 4,
  HighSchoolGraduate = 5,
  VocationalTechnical = 6,
  CollegeLevel = 7,
  CollegeGraduate = 8,
  PostGraduate = 9,
  Doctorate = 10,
  Other = 99
}

// Benefit Type Enum
export enum BenefitType {
  Death = 1,
  Medicare = 2,
  Disability = 3,
  LifeInsurance = 4,
  Retirement = 5,
  Education = 6,
  Housing = 7,
  Livelihood = 8,
  Other = 99
}

// Helper functions for the new enums
export const getAddressTypeLabel = (type: number): string => {
  switch (type) {
    case AddressType.Home:
      return 'Home Address';
    case AddressType.Work:
      return 'Work Address';
    case AddressType.Mailing:
      return 'Mailing Address';
    case AddressType.Billing:
      return 'Billing Address';
    case AddressType.Permanent:
      return 'Permanent Address';
    case AddressType.Temporary:
      return 'Temporary Address';
    case AddressType.Previous:
      return 'Previous Address';
    case AddressType.EmergencyContact:
      return 'Emergency Contact Address';
    case AddressType.Other:
      return 'Other Address';
    default:
      return 'Unknown';
  }
};

export const getRelationshipTypeLabel = (type: number): string => {
  switch (type) {
    case RelationshipType.Spouse:
      return 'Spouse';
    case RelationshipType.Child:
      return 'Child';
    case RelationshipType.Parent:
      return 'Parent';
    case RelationshipType.Sibling:
      return 'Sibling';
    case RelationshipType.Grandparent:
      return 'Grandparent';
    case RelationshipType.Grandchild:
      return 'Grandchild';
    case RelationshipType.UncleAunt:
      return 'Uncle/Aunt';
    case RelationshipType.NieceNephew:
      return 'Niece/Nephew';
    case RelationshipType.Cousin:
      return 'Cousin';
    case RelationshipType.StepChild:
      return 'Step Child';
    case RelationshipType.StepParent:
      return 'Step Parent';
    case RelationshipType.StepSibling:
      return 'Step Sibling';
    case RelationshipType.InLaw:
      return 'In-Law';
    case RelationshipType.FosterChild:
      return 'Foster Child';
    case RelationshipType.AdoptedChild:
      return 'Adopted Child';
    case RelationshipType.LegalGuardian:
      return 'Legal Guardian';
    case RelationshipType.Other:
      return 'Other';
    default:
      return 'Unknown';
  }
};

export const getBenefitTypeLabel = (type: number): string => {
  switch (type) {
    case BenefitType.Death:
      return 'Death Benefits';
    case BenefitType.Medicare:
      return 'Medicare';
    case BenefitType.Disability:
      return 'Disability Benefits';
    case BenefitType.LifeInsurance:
      return 'Life Insurance';
    case BenefitType.Retirement:
      return 'Retirement Benefits';
    case BenefitType.Education:
      return 'Education Benefits';
    case BenefitType.Housing:
      return 'Housing Benefits';
    case BenefitType.Livelihood:
      return 'Livelihood Benefits';
    case BenefitType.Other:
      return 'Other Benefits';
    default:
      return 'Unknown';
  }
};

export const getEducationAttainmentTypeLabel = (type: number): string => {
  switch (type) {
    case EducationAttainmentType.NoFormalEducation:
      return 'No Formal Education';
    case EducationAttainmentType.ElementaryLevel:
      return 'Elementary Level';
    case EducationAttainmentType.ElementaryGraduate:
      return 'Elementary Graduate';
    case EducationAttainmentType.HighSchoolLevel:
      return 'High School Level';
    case EducationAttainmentType.HighSchoolGraduate:
      return 'High School Graduate';
    case EducationAttainmentType.VocationalTechnical:
      return 'Vocational/Technical';
    case EducationAttainmentType.CollegeLevel:
      return 'College Level';
    case EducationAttainmentType.CollegeGraduate:
      return 'College Graduate';
    case EducationAttainmentType.PostGraduate:
      return 'Post Graduate';
    case EducationAttainmentType.Doctorate:
      return 'Doctorate';
    case EducationAttainmentType.Other:
      return 'Other';
    default:
      return 'Unknown';
  }
};
