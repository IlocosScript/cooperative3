// Member DTOs for API integration

// API Response interfaces (PascalCase)
export interface MemberApiResponse {
  Id: number;
  MemberNumber: string;
  FirstName: string;
  LastName: string;
  MiddleName: string | null;
  DateOfBirth: string;
  Birthplace?: string;
  GenderType: string | number;
  CivilStatus: string | number;
  Tin?: string;
  BodNumber?: string;
  Status: string | number;
  MembershipType: string | number;
  MembershipDate: string | null;
  TerminationDate?: string | null;
  Notes?: string;
  CreatedAt: string;
  UpdatedAt?: string | null;
  CreatedBy?: string;
  UpdatedBy?: string | null;
  FullName: string;
  FullNameWithMiddle?: string;
  Age: number;
  CompleteAddress?: string;
  PrimaryAddress: string;
  PrimaryContactNumber: string;
  Addresses?: AddressApiResponse[];
  ContactNumbers?: ContactNumberApiResponse[];
  Dependents?: DependentApiResponse[];
  Educations?: EducationApiResponse[];
  Incomes?: IncomeApiResponse[];
  Attachments?: FileAttachmentApiResponse[];
}

// Form Data interfaces (camelCase)
export interface Member {
  Id: number;
  MemberNumber: string;
  FirstName: string;
  LastName: string;
  MiddleName: string | null;
  DateOfBirth: string;
  Birthplace?: string;
  GenderType: number;
  CivilStatus: number;
  Tin?: string;
  BodNumber?: string;
  Status: number;
  MembershipType: number;
  MembershipDate: string;
  TerminationDate?: string;
  Notes?: string;
  CreatedAt: string;
  UpdatedAt?: string;
  CreatedBy?: string;
  UpdatedBy?: string;
  FullName: string;
  FullNameWithMiddle?: string;
  Age: number;
  CompleteAddress?: string;
  PrimaryAddress: string;
  PrimaryContactNumber: string;
  addresses?: Address[];
  contactNumbers?: ContactNumber[];
  dependents?: Dependent[];
  educations?: Education[];
  incomes?: Income[];
  attachments?: FileAttachment[];
}

// API Response interfaces (PascalCase)
export interface AddressApiResponse {
  Id: number;
  AddressType: string | number;
  StreetAddress1: string;
  StreetAddress2?: string;
  City: string;
  Province: string;
  PostalCode: string;
  Country: string;
  IsPrimary: boolean;
  IsCurrent: boolean;
  Notes?: string;
  CreatedAt: string;
  UpdatedAt?: string | null;
  CompleteAddress?: string;
  AddressSummary?: string;
  DisplayName?: string;
}

// Form Data interfaces (camelCase)
export interface Address {
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
}

// API Response interfaces (PascalCase)
export interface ContactNumberApiResponse {
  Id: number;
  PhoneNumber: string;
  IsPrimary: boolean;
  CreatedAt: string;
  UpdatedAt?: string | null;
}

// Form Data interfaces (camelCase)
export interface ContactNumber {
  phoneNumber: string;
  isPrimary: boolean;
}

// API Response interfaces (PascalCase)
export interface DependentApiResponse {
  Id: number;
  FirstName: string;
  LastName: string;
  MiddleName?: string;
  Relationship: string | number;
  DateOfBirth?: string | null;
  GenderType: string | number;
  Address?: string;
  IsDependent: boolean;
  IsBeneficiary: boolean;
  BenefitTypes: string[] | number[];
  CreatedAt: string;
  UpdatedAt?: string | null;
  FullName: string;
  FullNameWithMiddle?: string;
  Age?: number | null;
  DisplayName: string;
  Type: string;
  IsMinor: boolean;
  Benefits?: Array<{
    Id: number;
    MemberId: number;
    BeneficiaryId: number;
    BenefitType: string;
    CreatedAt: string;
    UpdatedAt?: string | null;
    CreatedBy?: string;
    UpdatedBy?: string | null;
    BeneficiaryName: string;
    BenefitTypeName: string;
  }>;
}

// Form Data interfaces (camelCase)
export interface Dependent {
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
}

// API Response interfaces (PascalCase)
export interface EducationApiResponse {
  Id: number;
  EducationAttainmentType: string | number;
  SchoolName: string;
  Course?: string;
  YearCompleted: number;
  YearStarted: number;
  IsHighestAttainment: boolean;
  Notes?: string;
  CreatedAt: string;
  UpdatedAt?: string | null;
  DurationInYears: number;
  DisplayName: string;
  YearRange: string;
}

// Form Data interfaces (camelCase)
export interface Education {
  educationAttainmentType: number;
  schoolName: string;
  course?: string;
  yearCompleted: number;
  yearStarted: number;
  isHighestAttainment: boolean;
  notes?: string;
}

// API Response interfaces (PascalCase)
export interface IncomeApiResponse {
  Id: number;
  Source: string;
  IncomeAmount: number;
  IsPrimary: boolean;
  CreatedAt: string;
  UpdatedAt?: string | null;
  FormattedIncome: string;
  DisplayName: string;
}

// Form Data interfaces (camelCase)
export interface Income {
  source: string;
  incomeAmount: number;
  isPrimary: boolean;
}

// API Response interfaces (PascalCase)
export interface FileAttachmentApiResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

// Form Data interfaces (camelCase)
export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
  url?: string;
}

// Create Member Request DTO
export interface CreateMemberRequest {
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
  addresses: Address[];
  contactNumbers: ContactNumber[];
  dependents: Dependent[];
  educations: Education[];
  incomes: Income[];
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

/**
 * Represents the gender of a person
 */
export enum Gender {
  /** Male */
  Male = 1,
  /** Female */
  Female = 2,
  /** Non-binary */
  NonBinary = 3,
  /** Prefer not to say */
  PreferNotToSay = 4,
  /** Other gender identity */
  Other = 5
}

/**
 * Represents the civil status of a member
 */
export enum CivilStatus {
  /** Single (never married) */
  Single = 1,
  /** Married */
  Married = 2,
  /** Widowed (spouse has passed away) */
  Widowed = 3,
  /** Divorced */
  Divorced = 4,
  /** Separated (legally separated but not divorced) */
  Separated = 5,
  /** In a domestic partnership or civil union */
  DomesticPartnership = 6,
  /** Annulled marriage */
  Annulled = 7,
  /** Other civil status not listed */
  Other = 99
}

/**
 * Represents the status of a cooperative member
 */
export enum MemberStatus {
  /** Pending status (default for new members) */
  PendingStatus = 0,
  /** Active member */
  Active = 1,
  /** Inactive member */
  Inactive = 2,
  /** Suspended member */
  Suspended = 3,
  /** Pending approval */
  Pending = 4,
  /** Terminated membership */
  Terminated = 5,
  /** On hold */
  OnHold = 6,
  /** Probationary member */
  Probationary = 7,
  /** Honorary member */
  Honorary = 8,
  /** Deceased member */
  Deceased = 9,
  /** Other status */
  Other = 99
}

/**
 * Represents the type of membership in the cooperative
 */
export enum MembershipType {
  /** Regular member */
  Member = 1
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

/**
 * Types of benefits available to cooperative members
 */
export enum BenefitType {
  /** Death benefit - paid to beneficiaries upon member's death */
  Death = 1,
  /** Medicare benefit - covers medical expenses */
  Medicare = 2,
  /** Disability benefit - paid when member becomes disabled */
  Disability = 3,
  /** Life insurance benefit */
  LifeInsurance = 4,
  /** Retirement benefit */
  Retirement = 5,
  /** Education benefit - for member's education or dependents */
  Education = 6,
  /** Housing benefit - for housing-related expenses */
  Housing = 7,
  /** Emergency benefit - for emergency situations */
  Emergency = 8,
  /** Funeral benefit - for funeral expenses */
  Funeral = 9,
  /** Other miscellaneous benefits */
  Other = 10
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
    case BenefitType.Emergency:
      return 'Emergency Benefits';
    case BenefitType.Funeral:
      return 'Funeral Benefits';
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
