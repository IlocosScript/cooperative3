// Member Modal specific DTOs
import { MemberApiResponse } from './member.dto';

// Modal-specific FileAttachment interface (extends the base one with additional fields)
export interface ModalFileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File; // Made optional - can be undefined for existing attachments
  description?: string;
  attachmentType: string; // Required field for attachment type
}

// Modal form data interface
export interface CreateMemberData {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  birthplace: string;
  genderType: number;
  civilStatus: number;
  tin: string;
  bodNumber?: string;
  memberNumber?: string;
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
  fileAttachments: ModalFileAttachment[];
}

// Modal props interface
export interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  memberData?: MemberApiResponse; // For update mode - API response type
  onSubmit?: (data: any) => void;
}

// Re-export the base interfaces that are used in the modal
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
}

export interface ContactNumber {
  phoneNumber: string;
  isPrimary: boolean;
}

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

export interface Education {
  educationAttainmentType: number;
  schoolName: string;
  course?: string;
  yearCompleted: number;
  yearStarted: number;
  isHighestAttainment: boolean;
}

export interface Income {
  source: string;
  incomeAmount: number;
  isPrimary: boolean;
}
