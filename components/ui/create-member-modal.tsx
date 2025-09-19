'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FileUploadApiService from '@/lib/services/fileUploadApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  X, 
  Upload, 
  FileText, 
  UserPlus,
  MapPin,
  Phone,
  Users,
  Paperclip,
  Loader2
} from 'lucide-react';
import { 
  Gender, 
  CivilStatus, 
  MemberStatus,
  MembershipType, 
  AddressType,
  RelationshipType,
  BenefitType,
  EducationAttainmentType,
  getGenderLabel, 
  getCivilStatusLabel, 
  getMembershipTypeLabel,
  getAddressTypeLabel,
  getRelationshipTypeLabel,
  getBenefitTypeLabel,
  getEducationAttainmentTypeLabel,
  CreateMemberRequest,
  Member,
  MemberApiResponse
} from '@/lib/types/members';

interface Address {
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

interface ContactNumber {
  phoneNumber: string;
  isPrimary: boolean;
}

interface Dependent {
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

interface Education {
  educationAttainmentType: number;
  schoolName: string;
  course?: string;
  yearCompleted: number;
  yearStarted: number;
  isHighestAttainment: boolean;
  notes?: string;
}

interface Income {
  source: string;
  incomeAmount: number;
  isPrimary: boolean;
}

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  description?: string;
}

interface CreateMemberData {
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
  fileAttachments: FileAttachment[];
}

interface CreateMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  memberData?: MemberApiResponse; // For update mode - API response type
  onSubmit?: (data: Member | MemberApiResponse) => void;
}

// Generate options from existing enums
const GENDER_OPTIONS = Object.values(Gender)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value as number,
    label: getGenderLabel(value as number)
  }));

const CIVIL_STATUS_OPTIONS = Object.values(CivilStatus)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value as number,
    label: getCivilStatusLabel(value as number)
  }));

const MEMBERSHIP_TYPE_OPTIONS = Object.values(MembershipType)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value as number,
    label: getMembershipTypeLabel(value as number)
  }));

const ADDRESS_TYPE_OPTIONS = Object.values(AddressType)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value as number,
    label: getAddressTypeLabel(value as number)
  }));

const RELATIONSHIP_OPTIONS = Object.values(RelationshipType)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value as number,
    label: getRelationshipTypeLabel(value as number)
  }));

const BENEFIT_TYPE_OPTIONS = Object.values(BenefitType)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value as number,
    label: getBenefitTypeLabel(value as number)
  }));

const EDUCATION_ATTAINMENT_OPTIONS = Object.values(EducationAttainmentType)
  .filter(value => typeof value === 'number')
  .map(value => ({
    value: value as number,
    label: getEducationAttainmentTypeLabel(value as number)
  }));

export default function CreateMemberModal({ isOpen, onClose, mode, memberData, onSubmit }: CreateMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState('addresses');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string>('');
  
  // Initialize form data
  const getInitialFormData = (): CreateMemberData => ({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    birthplace: '',
    genderType: Gender.Male,
    civilStatus: CivilStatus.Single,
    tin: '',
    bodNumber: '',
    memberNumber: '',
    status: MemberStatus.PendingStatus,
    membershipType: MembershipType.Member,
    membershipDate: new Date().toISOString(),
    terminationDate: '',
    notes: '',
    addresses: [
      {
        addressType: AddressType.Home,
        streetAddress1: '',
        streetAddress2: '',
        city: '',
        province: '',
        postalCode: '',
        country: 'Philippines',
        isPrimary: true,
        isCurrent: true,
        notes: ''
      }
    ],
    contactNumbers: [
      {
        phoneNumber: '',
        isPrimary: true
      }
    ],
    dependents: [],
    educations: [],
    incomes: [],
    fileAttachments: []
  });

  const [formData, setFormData] = useState<CreateMemberData>(getInitialFormData());


  // Populate form data when in update mode
  useEffect(() => {
    
    // Only populate when modal is open and we have memberData
    if (isOpen && mode === 'update' && memberData) {
      // Ensure we have proper contact numbers
      let contactNumbers: ContactNumber[] = [];
      if (Array.isArray(memberData.ContactNumbers) && memberData.ContactNumbers.length > 0) {
        contactNumbers = memberData.ContactNumbers.map(contact => ({
          phoneNumber: contact.PhoneNumber || '',
          isPrimary: contact.IsPrimary || false
        }));
      } else if (memberData.PrimaryContactNumber && memberData.PrimaryContactNumber.trim()) {
        contactNumbers = [
          {
            phoneNumber: memberData.PrimaryContactNumber,
            isPrimary: true
          }
        ];
      } else {
        contactNumbers = [
          {
            phoneNumber: '',
            isPrimary: true
          }
        ];
      }

      // If we have contact numbers but they're empty, try to use PrimaryContactNumber
      if (contactNumbers.length > 0 && (!contactNumbers[0].phoneNumber || contactNumbers[0].phoneNumber.trim() === '') && memberData.PrimaryContactNumber && memberData.PrimaryContactNumber.trim()) {
        contactNumbers[0].phoneNumber = memberData.PrimaryContactNumber;
      }

      // Ensure we have proper addresses
      let addresses: Address[] = [];
      if (Array.isArray(memberData.Addresses) && memberData.Addresses.length > 0) {
        addresses = memberData.Addresses.map(address => ({
          addressType: typeof address.AddressType === 'number' ? address.AddressType : AddressType.Home,
          streetAddress1: address.StreetAddress1 || '',
          streetAddress2: address.StreetAddress2 || '',
          city: address.City || '',
          province: address.Province || '',
          postalCode: address.PostalCode || '',
          country: address.Country || 'Philippines',
          isPrimary: address.IsPrimary || false,
          isCurrent: address.IsCurrent || false,
          notes: address.Notes || ''
        }));
      } else if (memberData.PrimaryAddress && memberData.PrimaryAddress.trim()) {
        addresses = [
          {
            addressType: AddressType.Home,
            streetAddress1: memberData.PrimaryAddress,
            streetAddress2: '',
            city: '',
            province: '',
            postalCode: '',
            country: 'Philippines',
            isPrimary: true,
            isCurrent: true,
            notes: ''
          }
        ];
      } else {
        addresses = [
          {
            addressType: AddressType.Home,
            streetAddress1: '',
            streetAddress2: '',
            city: '',
            province: '',
            postalCode: '',
            country: 'Philippines',
            isPrimary: true,
            isCurrent: true,
            notes: ''
          }
        ];
      }

      // If we have addresses but they're empty, try to use PrimaryAddress
      if (addresses.length > 0 && (!addresses[0].streetAddress1 || addresses[0].streetAddress1.trim() === '') && memberData.PrimaryAddress && memberData.PrimaryAddress.trim()) {
        addresses[0].streetAddress1 = memberData.PrimaryAddress;
      }

      // Helper function to convert string enum values to numbers
      const getGenderType = (genderType: any): number => {
        if (typeof genderType === 'number') return genderType;
        if (typeof genderType === 'string') {
          if (genderType.toLowerCase() === 'male') return Gender.Male;
          if (genderType.toLowerCase() === 'female') return Gender.Female;
          if (genderType.toLowerCase() === 'other') return Gender.Other;
        }
        return Gender.Male;
      };

      const getCivilStatus = (civilStatus: any): number => {
        if (typeof civilStatus === 'number') return civilStatus;
        if (typeof civilStatus === 'string') {
          if (civilStatus.toLowerCase() === 'single') return CivilStatus.Single;
          if (civilStatus.toLowerCase() === 'married') return CivilStatus.Married;
          if (civilStatus.toLowerCase() === 'divorced') return CivilStatus.Divorced;
          if (civilStatus.toLowerCase() === 'widowed') return CivilStatus.Widowed;
        }
        return CivilStatus.Single;
      };

      const getMembershipType = (membershipType: any): number => {
        if (typeof membershipType === 'number') return membershipType;
        if (typeof membershipType === 'string') {
          if (membershipType.toLowerCase() === 'member') return MembershipType.Member;
        }
        return MembershipType.Member;
      };

      const getStatus = (status: any): number => {
        if (typeof status === 'number') return status;
        if (typeof status === 'string') {
          if (status.toLowerCase() === 'pendingstatus') return MemberStatus.PendingStatus;
          if (status.toLowerCase() === 'active') return MemberStatus.Active;
          if (status.toLowerCase() === 'inactive') return MemberStatus.Inactive;
          if (status.toLowerCase() === 'terminated') return MemberStatus.Terminated;
        }
        return MemberStatus.PendingStatus;
      };

      const getRelationshipType = (relationship: any): number => {
        if (typeof relationship === 'number') return relationship;
        if (typeof relationship === 'string') {
          if (relationship.toLowerCase() === 'spouse') return RelationshipType.Spouse;
          if (relationship.toLowerCase() === 'child') return RelationshipType.Child;
          if (relationship.toLowerCase() === 'parent') return RelationshipType.Parent;
          if (relationship.toLowerCase() === 'sibling') return RelationshipType.Sibling;
          if (relationship.toLowerCase() === 'grandparent') return RelationshipType.Grandparent;
          if (relationship.toLowerCase() === 'grandchild') return RelationshipType.Grandchild;
          if (relationship.toLowerCase() === 'uncleaunt') return RelationshipType.UncleAunt;
          if (relationship.toLowerCase() === 'niecenephew') return RelationshipType.NieceNephew;
          if (relationship.toLowerCase() === 'cousin') return RelationshipType.Cousin;
          if (relationship.toLowerCase() === 'stepchild') return RelationshipType.StepChild;
          if (relationship.toLowerCase() === 'stepparent') return RelationshipType.StepParent;
          if (relationship.toLowerCase() === 'stepsibling') return RelationshipType.StepSibling;
          if (relationship.toLowerCase() === 'inlaw') return RelationshipType.InLaw;
          if (relationship.toLowerCase() === 'fosterchild') return RelationshipType.FosterChild;
          if (relationship.toLowerCase() === 'adoptedchild') return RelationshipType.AdoptedChild;
          if (relationship.toLowerCase() === 'legalguardian') return RelationshipType.LegalGuardian;
          if (relationship.toLowerCase() === 'other') return RelationshipType.Other;
        }
        return RelationshipType.Spouse; // Default to spouse
      };

      const getEducationAttainmentType = (educationType: any): number => {
        if (typeof educationType === 'number') return educationType;
        if (typeof educationType === 'string') {
          if (educationType.toLowerCase() === 'noformaleducation') return EducationAttainmentType.NoFormalEducation;
          if (educationType.toLowerCase() === 'elementarylevel') return EducationAttainmentType.ElementaryLevel;
          if (educationType.toLowerCase() === 'elementarygraduate') return EducationAttainmentType.ElementaryGraduate;
          if (educationType.toLowerCase() === 'highschoollevel') return EducationAttainmentType.HighSchoolLevel;
          if (educationType.toLowerCase() === 'highschoolgraduate') return EducationAttainmentType.HighSchoolGraduate;
          if (educationType.toLowerCase() === 'vocationaltechnical') return EducationAttainmentType.VocationalTechnical;
          if (educationType.toLowerCase() === 'collegelevel') return EducationAttainmentType.CollegeLevel;
          if (educationType.toLowerCase() === 'collegegraduate') return EducationAttainmentType.CollegeGraduate;
          if (educationType.toLowerCase() === 'postgraduate') return EducationAttainmentType.PostGraduate;
          if (educationType.toLowerCase() === 'doctorate') return EducationAttainmentType.Doctorate;
          if (educationType.toLowerCase() === 'other') return EducationAttainmentType.Other;
        }
        return EducationAttainmentType.CollegeGraduate; // Default to college graduate
      };

      const getBenefitTypes = (benefitTypes: any[]): number[] => {
        if (!Array.isArray(benefitTypes)) return [];
        
        return benefitTypes.map(benefitType => {
          if (typeof benefitType === 'number') return benefitType;
          if (typeof benefitType === 'string') {
            if (benefitType.toLowerCase() === 'death') return BenefitType.Death;
            if (benefitType.toLowerCase() === 'medicare') return BenefitType.Medicare;
            if (benefitType.toLowerCase() === 'disability') return BenefitType.Disability;
            if (benefitType.toLowerCase() === 'lifeinsurance') return BenefitType.LifeInsurance;
            if (benefitType.toLowerCase() === 'retirement') return BenefitType.Retirement;
            if (benefitType.toLowerCase() === 'education') return BenefitType.Education;
            if (benefitType.toLowerCase() === 'housing') return BenefitType.Housing;
            if (benefitType.toLowerCase() === 'emergency') return BenefitType.Emergency;
            if (benefitType.toLowerCase() === 'funeral') return BenefitType.Funeral;
            if (benefitType.toLowerCase() === 'other') return BenefitType.Other;
          }
          return BenefitType.Other; // Default to other
        });
      };

      // Transform Member data to CreateMemberData format
      const updateData: CreateMemberData = {
        firstName: memberData.FirstName || '',
        lastName: memberData.LastName || '',
        middleName: memberData.MiddleName || '',
        dateOfBirth: memberData.DateOfBirth || '',
        birthplace: memberData.Birthplace || '',
        genderType: getGenderType(memberData.GenderType),
        civilStatus: getCivilStatus(memberData.CivilStatus),
        tin: memberData.Tin || '',
        bodNumber: memberData.BodNumber || '',
        memberNumber: memberData.MemberNumber || '',
        status: getStatus(memberData.Status),
        membershipType: getMembershipType(memberData.MembershipType),
        membershipDate: memberData.MembershipDate || new Date().toISOString(),
        terminationDate: memberData.TerminationDate || '',
        notes: memberData.Notes || '',
        addresses: addresses,
        contactNumbers: contactNumbers,
        dependents: memberData.Dependents ? memberData.Dependents.map(dependent => {
          return {
            firstName: dependent.FirstName || '',
            lastName: dependent.LastName || '',
            middleName: dependent.MiddleName || '',
            relationship: getRelationshipType(dependent.Relationship),
            dateOfBirth: dependent.DateOfBirth || '',
            genderType: getGenderType(dependent.GenderType),
            address: dependent.Address || '',
            isDependent: dependent.IsDependent || false,
            isBeneficiary: dependent.IsBeneficiary || false,
            benefitTypes: getBenefitTypes(dependent.BenefitTypes)
          };
        }) : [],
        educations: memberData.Educations ? memberData.Educations.map(education => {
          return {
            educationAttainmentType: getEducationAttainmentType(education.EducationAttainmentType),
            schoolName: education.SchoolName || '',
            course: education.Course || '',
            yearCompleted: education.YearCompleted || new Date().getFullYear(),
            yearStarted: education.YearStarted || new Date().getFullYear(),
            isHighestAttainment: education.IsHighestAttainment || false,
            notes: education.Notes || ''
          };
        }) : [],
        incomes: memberData.Incomes ? memberData.Incomes.map(income => ({
          source: income.Source || '',
          incomeAmount: income.IncomeAmount || 0,
          isPrimary: income.IsPrimary || false
        })) : [],
        fileAttachments: memberData.Attachments ? memberData.Attachments.map(att => ({
          id: att.Id.toString(),
          name: att.OriginalFileName || '',
          size: att.FileSize || 0,
          type: att.ContentType || '',
          description: att.Description || '',
          file: new File([], att.OriginalFileName || '') // API response doesn't have file property
        })) : []
      };
      
   
      // Force update the state by using a functional update
      setFormData(prevData => {
        return updateData;
      });
      
      setCurrentStep(1);
      setErrors({});
      setApiError('');
    } else if (isOpen && mode === 'create') {
      // Reset form for create mode when modal opens
      setFormData(getInitialFormData());
      setCurrentStep(1);
      setErrors({});
      setApiError('');
    }
  }, [mode, memberData, isOpen]);


  const updateFormData = (field: keyof CreateMemberData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (index: number, field: keyof Address, value: any) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setFormData(prev => ({ ...prev, addresses: newAddresses }));
  };

  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        {
          addressType: 1,
          streetAddress1: '',
          streetAddress2: '',
          city: '',
          province: '',
          postalCode: '',
          country: 'Philippines',
          isPrimary: false,
          isCurrent: true,
          notes: ''
        }
      ]
    }));
  };

  const removeAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const updateContactNumber = (index: number, field: keyof ContactNumber, value: any) => {
    const newContactNumbers = [...formData.contactNumbers];
    newContactNumbers[index] = { ...newContactNumbers[index], [field]: value };
    setFormData(prev => ({ ...prev, contactNumbers: newContactNumbers }));
  };

  const addContactNumber = () => {
    setFormData(prev => ({
      ...prev,
      contactNumbers: [
        ...prev.contactNumbers,
        {
          phoneNumber: '',
          isPrimary: false
        }
      ]
    }));
  };

  const removeContactNumber = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contactNumbers: prev.contactNumbers.filter((_, i) => i !== index)
    }));
  };

  const addDependent = () => {
    setFormData(prev => ({
      ...prev,
      dependents: [
        ...prev.dependents,
        {
          firstName: '',
          lastName: '',
          middleName: '',
          relationship: 1,
          dateOfBirth: '',
          genderType: 1,
          address: '',
          isDependent: true,
          isBeneficiary: true,
          benefitTypes: []
        }
      ]
    }));
  };

  const updateDependent = (index: number, field: keyof Dependent, value: any) => {
    const newDependents = [...formData.dependents];
    newDependents[index] = { ...newDependents[index], [field]: value };
    setFormData(prev => ({ ...prev, dependents: newDependents }));
  };

  const removeDependent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          educationAttainmentType: 1,
          schoolName: '',
          course: '',
          yearCompleted: new Date().getFullYear(),
          yearStarted: new Date().getFullYear(),
          isHighestAttainment: false,
          notes: ''
        }
      ]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const newEducations = [...formData.educations];
    newEducations[index] = { ...newEducations[index], [field]: value };
    setFormData(prev => ({ ...prev, educations: newEducations }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index)
    }));
  };

  const addIncome = () => {
    setFormData(prev => ({
      ...prev,
      incomes: [
        ...prev.incomes,
        {
          source: '',
          incomeAmount: 0,
          isPrimary: false
        }
      ]
    }));
  };

  const updateIncome = (index: number, field: keyof Income, value: any) => {
    const newIncomes = [...formData.incomes];
    newIncomes[index] = { ...newIncomes[index], [field]: value };
    setFormData(prev => ({ ...prev, incomes: newIncomes }));
  };

  const removeIncome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      incomes: prev.incomes.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments: FileAttachment[] = [];
      
      Array.from(files).forEach(file => {
        // Use the centralized validation from FileUploadApiService
        const validation = FileUploadApiService.validateFile(file);
        
        if (!validation.isValid) {
          // Provide more user-friendly error messages
          let userFriendlyError = validation.error || 'File validation failed';
          
          if (validation.error && validation.error.includes('exceeds') && validation.error.includes('MB')) {
            userFriendlyError = `File size exceeds 10MB limit. Please choose a smaller file.`;
          } else if (validation.error && validation.error.includes('File type not allowed')) {
            userFriendlyError = `File type not supported. Please use PDF, JPG, JPEG, PNG, DOC, or DOCX files.`;
          } else if (validation.error && validation.error.includes('cannot be empty')) {
            userFriendlyError = `File is empty. Please choose a valid file.`;
          }
          
          toast.error(`"${file.name}": ${userFriendlyError}`);
          return;
        }

        
        newAttachments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file
        });
      });
      
      if (newAttachments.length > 0) {
      setFormData(prev => ({
        ...prev,
        fileAttachments: [...prev.fileAttachments, ...newAttachments]
      }));
        toast.success(`${newAttachments.length} file(s) added successfully`);
    }
    }
    
    // Clear the input to allow selecting the same files again
    event.target.value = '';
  };

  const removeFile = (id: string) => {
    const fileToRemove = formData.fileAttachments.find(file => file.id === id);
    setFormData(prev => ({
      ...prev,
      fileAttachments: prev.fileAttachments.filter(file => file.id !== id)
    }));
    
    // Show toast notification for file removal
    if (fileToRemove) {
      toast.info(`File "${fileToRemove.name}" removed`);
    }
  };

  const updateFileDescription = (id: string, description: string) => {
    setFormData(prev => ({
      ...prev,
      fileAttachments: prev.fileAttachments.map(file => 
        file.id === id ? { ...file, description } : file
      )
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    // Prevent double submission
    if (isLoading) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setApiError('');
    
    try {
      // Validate required fields
      const validationErrors: { [key: string]: string } = {};
      
      if (!formData.firstName.trim()) {
        validationErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        validationErrors.lastName = 'Last name is required';
      }
      if (!formData.dateOfBirth) {
        validationErrors.dateOfBirth = 'Date of birth is required';
      }
      if (!formData.membershipDate) {
        validationErrors.membershipDate = 'Membership date is required';
      }
      
      // Validate addresses
      if (formData.addresses.length === 0) {
        validationErrors.addresses = 'At least one address is required';
      } else {
        formData.addresses.forEach((address, index) => {
          const addressNumber = index + 1;
          if (!address.streetAddress1.trim()) {
            validationErrors[`addresses.${index}.streetAddress1`] = `Address ${addressNumber}: Street address is required`;
          }
          if (!address.city.trim()) {
            validationErrors[`addresses.${index}.city`] = `Address ${addressNumber}: City is required`;
          }
          if (!address.province.trim()) {
            validationErrors[`addresses.${index}.province`] = `Address ${addressNumber}: Province is required`;
          }
        });
      }
      
      // Validate contact numbers
      if (formData.contactNumbers.length === 0) {
        validationErrors.contactNumbers = 'At least one contact number is required';
      } else {
        formData.contactNumbers.forEach((contact, index) => {
          const contactNumber = index + 1;
          if (!contact.phoneNumber.trim()) {
            validationErrors[`contactNumbers.${index}.phoneNumber`] = `Contact ${contactNumber}: Phone number is required`;
          }
        });
      }
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error('Please fix the validation errors before submitting');
        return;
      }


      // Transform form data to match API structure
      const memberRequest: CreateMemberRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || '',
        dateOfBirth: formData.dateOfBirth,
        birthplace: formData.birthplace || '',
        genderType: formData.genderType,
        civilStatus: formData.civilStatus,
        tin: formData.tin || '',
        bodNumber: formData.bodNumber || '',
        memberNumber: formData.memberNumber || '',
        status: formData.status,
        membershipType: formData.membershipType,
        membershipDate: formData.membershipDate,
        terminationDate: formData.terminationDate || undefined,
        notes: formData.notes || '',
        addresses: formData.addresses,
        contactNumbers: formData.contactNumbers,
        dependents: formData.dependents,
        educations: formData.educations,
        incomes: formData.incomes
      };

      // Import the API services
      const MembersApiService = await import('@/lib/services/membersApi');
      
      let result: Member|MemberApiResponse;
      let memberId: number;
      
      if (mode === 'create') {
        // Call the API to create member (without files)
        result = await MembersApiService.default.createMember(memberRequest);
        memberId = (result as Member).Id;
      } else {
        // Call the API to update member
        if (!memberData?.Id) {
          throw new Error('Member ID is required for update');
        }
        
        // Transform form data to match API update format (camelCase)
        const updateRequest = {
          firstName: memberRequest.firstName,
          lastName: memberRequest.lastName,
          middleName: memberRequest.middleName,
          dateOfBirth: memberRequest.dateOfBirth,
          birthplace: memberRequest.birthplace,
          genderType: memberRequest.genderType,
          civilStatus: memberRequest.civilStatus,
          tin: memberRequest.tin,
          bodNumber: memberRequest.bodNumber,
          status: memberRequest.status,
          membershipType: memberRequest.membershipType,
          membershipDate: memberRequest.membershipDate,
          terminationDate: memberRequest.terminationDate,
          notes: memberRequest.notes,
          addresses: memberRequest.addresses.map((address, index) => {
            // If we have the original address data, use its ID, otherwise null for new
            const originalAddress = memberData?.Addresses?.[index];
            return {
              id: originalAddress?.Id || null,
              addressType: address.addressType,
              streetAddress1: address.streetAddress1,
              streetAddress2: address.streetAddress2,
              city: address.city,
              province: address.province,
              postalCode: address.postalCode,
              country: address.country,
              isPrimary: address.isPrimary,
              isCurrent: address.isCurrent,
              notes: address.notes
            };
          }),
          contactNumbers: memberRequest.contactNumbers.map((contact, index) => {
            // If we have the original contact data, use its ID, otherwise null for new
            const originalContact = memberData?.ContactNumbers?.[index];
            return {
              id: originalContact?.Id || null,
              phoneNumber: contact.phoneNumber,
              isPrimary: contact.isPrimary
            };
          }),
          dependents: memberRequest.dependents.map((dependent, index) => {
            // If we have the original dependent data, use its ID, otherwise null for new
            const originalDependent = memberData?.Dependents?.[index];
            return {
              id: originalDependent?.Id || null,
              firstName: dependent.firstName,
              lastName: dependent.lastName,
              middleName: dependent.middleName,
              relationship: dependent.relationship,
              dateOfBirth: dependent.dateOfBirth,
              genderType: dependent.genderType,
              address: dependent.address,
              isDependent: dependent.isDependent,
              isBeneficiary: dependent.isBeneficiary,
              benefitTypes: dependent.benefitTypes
            };
          }),
          educations: memberRequest.educations.map((education, index) => {
            // If we have the original education data, use its ID, otherwise null for new
            const originalEducation = memberData?.Educations?.[index];
            return {
              id: originalEducation?.Id || null,
              educationAttainmentType: education.educationAttainmentType,
              schoolName: education.schoolName,
              course: education.course,
              yearCompleted: education.yearCompleted,
              yearStarted: education.yearStarted,
              isHighestAttainment: education.isHighestAttainment,
              notes: education.notes
            };
          }),
          incomes: memberRequest.incomes.map((income, index) => {
            // If we have the original income data, use its ID, otherwise null for new
            const originalIncome = memberData?.Incomes?.[index];
            return {
              id: originalIncome?.Id || null,
              source: income.source,
              incomeAmount: income.incomeAmount,
              isPrimary: income.isPrimary
            };
          }),
          // Include list of existing attachments that should be kept
          // This allows the server to know which attachments to delete (those not in this list)
          attachments: formData.fileAttachments
            .filter(attachment => !attachment.file || attachment.file.size === 0) // Only existing attachments (no File object)
            .map(attachment => ({
              id: parseInt(attachment.id), // Convert string ID back to number
              fileName: attachment.name,
              description: attachment.description || ''
            }))
        };
        
        result = await MembersApiService.default.updateMember(memberData.Id, updateRequest);
        memberId = memberData.Id;
      }

      // Upload files using the new file upload API if there are files to upload
      if (formData.fileAttachments.length > 0) {
        // Show immediate feedback about file attachments
        const existingFilesCount = formData.fileAttachments.filter(attachment => !attachment.file || attachment.file.size === 0).length;
        const newFilesCount = formData.fileAttachments.filter(attachment => attachment.file && attachment.file.size > 0).length;
        
        if (existingFilesCount > 0 && newFilesCount > 0) {
          toast.info(`Found ${existingFilesCount} existing attachment(s) and ${newFilesCount} new file(s) to upload`);
        } else if (existingFilesCount > 0) {
          toast.info(`Found ${existingFilesCount} existing attachment(s) to manage`);
        } else if (newFilesCount > 0) {
          toast.info(`Found ${newFilesCount} new file(s) to upload`);
        }
        setIsUploadingFiles(true);
        setUploadProgress({});
        
        // Show upload start notification
        if (newFilesCount > 0) {
          toast.info(`Starting upload of ${newFilesCount} new file(s)...`);
        }
        
        try {
          // Get current user (you might want to get this from your auth context)
          // For now, using a placeholder - replace with actual user from auth context
          const uploadedBy = localStorage.getItem('current-user') || 'system-user';
          
          // Extract files and descriptions for multi-file upload
          const files = formData.fileAttachments
            .filter(attachment => attachment.file && attachment.file.size > 0) // Only include valid files
            .map(attachment => attachment.file!);
          const descriptions = formData.fileAttachments
            .filter(attachment => attachment.file && attachment.file.size > 0) // Match the same filter
            .map(attachment => 
              attachment.description || `Member document - ${attachment.name}`
            );


          // Check if there are new files to upload
          if (files.length === 0) {
            // No new files to upload, but existing files are already displayed
            toast.info('No new files to upload - existing attachments are preserved');
          } else {
    
          // Upload all files at once using the new multi-file upload endpoint
          const uploadResults = await FileUploadApiService.uploadMultipleFileAttachments(
            files,
            1, // EntityType: 1 = Member
            memberId,
            uploadedBy,
            descriptions
          );
          
          
            const successMessage = mode === 'create' 
              ? `Member created and ${files.length} file(s) uploaded successfully!`
              : `Member updated with ${existingFilesCount} existing attachment(s) and ${files.length} new file(s) uploaded successfully!`;
            toast.success(successMessage);
          }
        } catch (error) {
          
          // Parse error message to provide more specific feedback
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          // Check if it's a partial success (some files uploaded)
          if (errorMessage.includes('uploaded successfully')) {
            toast.warning(`Member ${mode === 'create' ? 'created' : 'updated'} successfully, but some files failed to upload. ${errorMessage}`);
          } else if (errorMessage.includes('At least one file is required')) {
            toast.error('No files were selected for upload. Please select at least one file.');
          } else if (errorMessage.includes('File size exceeds')) {
            toast.error('Upload failed: One or more files exceed the 10MB size limit. Please check your files and try again.');
          } else if (errorMessage.includes('File type not allowed')) {
            toast.error('Upload failed: One or more files are not in the allowed format. Please use PDF, JPG, JPEG, PNG, DOC, or DOCX files only.');
          } else if (errorMessage.includes('File cannot be empty')) {
            toast.error('Upload failed: One or more files are empty. Please check your files and try again.');
          } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            toast.error('Upload failed: Network connection error. Please check your internet connection and try again.');
          } else if (errorMessage.includes('timeout')) {
            toast.error('Upload failed: Request timed out. Please try again with smaller files or check your connection.');
          } else {
            // Generic error message
            toast.error(`Member ${mode === 'create' ? 'created' : 'updated'} successfully, but file upload failed: ${errorMessage}`);
          }
        } finally {
          setIsUploadingFiles(false);
          setUploadProgress({});
        }
      } else {
        // No files to upload, just show success message
        toast.success(`Member ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      }
      
      // Call onSubmit callback with the result
      if (onSubmit) {
        // Pass the result directly - parent component will handle type conversion
        onSubmit(result as Member | MemberApiResponse);
      }
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        birthplace: '',
        genderType: Gender.Male,
        civilStatus: CivilStatus.Single,
        tin: '',
        bodNumber: '',
        memberNumber: '',
        status: MemberStatus.PendingStatus,
        membershipType: MembershipType.Member,
        membershipDate: new Date().toISOString(),
        terminationDate: '',
        notes: '',
        addresses: [
          {
            addressType: AddressType.Home,
            streetAddress1: '',
            streetAddress2: '',
            city: '',
            province: '',
            postalCode: '',
            country: 'Philippines',
            isPrimary: true,
            isCurrent: true,
            notes: ''
          }
        ],
        contactNumbers: [
          {
            phoneNumber: '',
            isPrimary: true
          }
        ],
        dependents: [],
        educations: [],
        incomes: [],
        fileAttachments: []
      });
      setCurrentStep(1);
      setErrors({});
      setApiError('');
      onClose();
    } catch (error) {
      
      // Handle API errors
      if (error instanceof Error) {
        const userFriendlyError = makeErrorUserFriendly(error.message);
        setApiError(userFriendlyError);
        toast.error(userFriendlyError);
      } else {
        setApiError('Failed to create member');
        toast.error('Failed to create member');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateCurrentStep = () => {
    const validationErrors: { [key: string]: string } = {};
    
    // Validate based on current step
    switch (currentStep) {
      case 1:
        if (!formData.firstName.trim()) {
          validationErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
          validationErrors.lastName = 'Last name is required';
        }
        if (!formData.dateOfBirth) {
          validationErrors.dateOfBirth = 'Date of birth is required';
        }
        if (!formData.membershipDate) {
          validationErrors.membershipDate = 'Membership date is required';
        }
        if (formData.contactNumbers.length === 0) {
          validationErrors.contactNumbers = 'At least one contact number is required';
        } else {
          formData.contactNumbers.forEach((contact, index) => {
            const contactNumber = index + 1;
            if (!contact.phoneNumber.trim()) {
              validationErrors[`contactNumbers.${index}.phoneNumber`] = `Contact ${contactNumber}: Phone number is required`;
            }
          });
        }
        break;
      case 2:
        if (formData.addresses.length === 0) {
          validationErrors.addresses = 'At least one address is required';
        } else {
          formData.addresses.forEach((address, index) => {
            const addressNumber = index + 1;
            if (!address.streetAddress1.trim()) {
              validationErrors[`addresses.${index}.streetAddress1`] = `Address ${addressNumber}: Street address is required`;
            }
            if (!address.city.trim()) {
              validationErrors[`addresses.${index}.city`] = `Address ${addressNumber}: City is required`;
            }
            if (!address.province.trim()) {
              validationErrors[`addresses.${index}.province`] = `Address ${addressNumber}: Province is required`;
            }
          });
        }
        break;
      case 3:
        // Dependents step - no required validation, can be empty
        break;
      case 4:
        // Education step - no required validation, can be empty
        break;
      case 5:
        // Income step - no required validation, can be empty
        break;
      case 6:
        // File attachments step - no required validation, can be empty
        break;
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    } else {
      toast.error('Please fix the validation errors before proceeding');
    }
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Navigate to a specific step
  const goToStep = (step: number) => {
    // In update mode, allow navigation to any step
    // In create mode, only allow navigation to current step or previous valid steps
    if (mode === 'update') {
      setCurrentStep(step);
    } else {
      // In create mode, only allow going to current step or previous steps
      if (step <= currentStep) {
        setCurrentStep(step);
      } else {
        // For future steps, validate all previous steps first
        let canNavigate = true;
        for (let i = 1; i < step; i++) {
          if (!isStepValid(i)) {
            canNavigate = false;
            break;
          }
        }
        if (canNavigate) {
          setCurrentStep(step);
        } else {
          toast.error('Please complete all previous steps before navigating to this step');
        }
      }
    }
  };

  // Check if a specific step is valid
  const isStepValid = (step: number) => {
    const validationErrors: { [key: string]: string } = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) validationErrors.firstName = 'Required';
        if (!formData.lastName.trim()) validationErrors.lastName = 'Required';
        if (!formData.dateOfBirth) validationErrors.dateOfBirth = 'Required';
        if (!formData.membershipDate) validationErrors.membershipDate = 'Required';
        if (formData.contactNumbers.length === 0) {
          validationErrors.contactNumbers = 'Required';
        } else {
          formData.contactNumbers.forEach((contact, index) => {
            if (!contact.phoneNumber.trim()) {
              validationErrors[`contactNumbers.${index}.phoneNumber`] = 'Required';
            }
          });
        }
        break;
      case 2:
        if (formData.addresses.length === 0) {
          validationErrors.addresses = 'Required';
        } else {
          formData.addresses.forEach((address, index) => {
            if (!address.streetAddress1.trim()) {
              validationErrors[`addresses.${index}.streetAddress1`] = 'Required';
            }
            if (!address.city.trim()) {
              validationErrors[`addresses.${index}.city`] = 'Required';
            }
            if (!address.province.trim()) {
              validationErrors[`addresses.${index}.province`] = 'Required';
            }
          });
        }
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        // These steps are optional, always valid
        break;
    }
    
    return Object.keys(validationErrors).length === 0;
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      // Tab key pressed - try to go to next step
      event.preventDefault();
      nextStep();
    } else if (event.key === 'Tab' && event.shiftKey) {
      // Shift+Tab pressed - go to previous step
      event.preventDefault();
      prevStep();
    }
  };

  // Function to make API errors more user-friendly
  const makeErrorUserFriendly = (errorMessage: string): string => {
    // Replace array indices with user-friendly names
    let friendlyError = errorMessage;
    
    // Replace address array indices
    friendlyError = friendlyError.replace(/Addresses\[(\d+)\]/g, (match, index) => {
      const addressNumber = parseInt(index) + 1;
      return `Address ${addressNumber}`;
    });
    
    // Replace contact array indices
    friendlyError = friendlyError.replace(/ContactNumbers\[(\d+)\]/g, (match, index) => {
      const contactNumber = parseInt(index) + 1;
      return `Contact ${contactNumber}`;
    });
    
    // Replace dependent array indices
    friendlyError = friendlyError.replace(/Dependents\[(\d+)\]/g, (match, index) => {
      const dependentNumber = parseInt(index) + 1;
      return `Dependent ${dependentNumber}`;
    });
    
    // Replace education array indices
    friendlyError = friendlyError.replace(/Educations\[(\d+)\]/g, (match, index) => {
      const educationNumber = parseInt(index) + 1;
      return `Education ${educationNumber}`;
    });
    
    // Replace income array indices
    friendlyError = friendlyError.replace(/Incomes\[(\d+)\]/g, (match, index) => {
      const incomeNumber = parseInt(index) + 1;
      return `Income ${incomeNumber}`;
    });
    
    // Replace field names with more user-friendly versions
    friendlyError = friendlyError
      .replace(/FirstName/g, 'First Name')
      .replace(/LastName/g, 'Last Name')
      .replace(/MiddleName/g, 'Middle Name')
      .replace(/DateOfBirth/g, 'Date of Birth')
      .replace(/GenderType/g, 'Gender')
      .replace(/CivilStatus/g, 'Civil Status')
      .replace(/MembershipType/g, 'Membership Type')
      .replace(/MembershipDate/g, 'Membership Date')
      .replace(/TerminationDate/g, 'Termination Date')
      .replace(/StreetAddress1/g, 'Street Address')
      .replace(/StreetAddress2/g, 'Street Address 2')
      .replace(/PostalCode/g, 'Postal Code')
      .replace(/PhoneNumber/g, 'Phone Number')
      .replace(/IsPrimary/g, 'Primary')
      .replace(/IsCurrent/g, 'Current')
      .replace(/IsDependent/g, 'Dependent')
      .replace(/IsBeneficiary/g, 'Beneficiary')
      .replace(/BenefitTypes/g, 'Benefit Types')
      .replace(/EducationAttainmentType/g, 'Education Level')
      .replace(/SchoolName/g, 'School Name')
      .replace(/YearCompleted/g, 'Year Completed')
      .replace(/YearStarted/g, 'Year Started')
      .replace(/IsHighestAttainment/g, 'Highest Attainment')
      .replace(/IncomeAmount/g, 'Income Amount');
    
    return friendlyError;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* API Error Display */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{apiError}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName || ''}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            className={errors.firstName ? 'border-red-500' : ''}
            required
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName || ''}
            onChange={(e) => updateFormData('middleName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName || ''}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            className={errors.lastName ? 'border-red-500' : ''}
            required
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth ? (formData.dateOfBirth.includes('T') ? formData.dateOfBirth.split('T')[0] : formData.dateOfBirth) : ''}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            className={errors.dateOfBirth ? 'border-red-500' : ''}
            required
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>
        <div>
          <Label htmlFor="birthplace">Birthplace</Label>
          <Input
            id="birthplace"
            value={formData.birthplace || ''}
            onChange={(e) => updateFormData('birthplace', e.target.value)}
            placeholder="e.g., Manila, Philippines"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="genderType">Gender *</Label>
          <Select value={formData.genderType?.toString() || ''} onValueChange={(value) => updateFormData('genderType', parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="civilStatus">Civil Status *</Label>
          <Select value={formData.civilStatus?.toString() || ''} onValueChange={(value) => updateFormData('civilStatus', parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select civil status" />
            </SelectTrigger>
            <SelectContent>
              {CIVIL_STATUS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tin">TIN Number</Label>
          <Input
            id="tin"
            value={formData.tin || ''}
            onChange={(e) => updateFormData('tin', e.target.value)}
            placeholder="123456789"
          />
        </div>
      </div>

             <div className="grid grid-cols-3 gap-4">
         <div>
           <Label htmlFor="membershipType">Membership Type *</Label>
           <Select value={formData.membershipType?.toString() || ''} onValueChange={(value) => updateFormData('membershipType', parseInt(value))}>
             <SelectTrigger>
               <SelectValue placeholder="Select membership type" />
             </SelectTrigger>
             <SelectContent>
               {MEMBERSHIP_TYPE_OPTIONS.map(option => (
                 <SelectItem key={option.value} value={option.value.toString()}>
                   {option.label}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
         <div>
           <Label htmlFor="memberNumber">Member Number</Label>
           <Input
             id="memberNumber"
             value={formData.memberNumber || ''}
             onChange={(e) => updateFormData('memberNumber', e.target.value)}
             placeholder="e.g., MEM001"
           />
         </div>
         <div>
           <Label htmlFor="bodNumber">BOD Number</Label>
           <Input
             id="bodNumber"
             value={formData.bodNumber || ''}
             onChange={(e) => updateFormData('bodNumber', e.target.value)}
             placeholder="BOD001"
           />
         </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
         <div>
           <Label htmlFor="membershipDate">Membership Date *</Label>
           <Input
             id="membershipDate"
             type="date"
             value={formData.membershipDate ? (formData.membershipDate.includes('T') ? formData.membershipDate.split('T')[0] : formData.membershipDate) : ''}
             onChange={(e) => updateFormData('membershipDate', new Date(e.target.value).toISOString())}
             className={errors.membershipDate ? 'border-red-500' : ''}
             required
           />
           {errors.membershipDate && (
             <p className="mt-1 text-sm text-red-600">{errors.membershipDate}</p>
           )}
         </div>
         <div>
           <Label htmlFor="terminationDate">Termination Date</Label>
           <Input
             id="terminationDate"
             type="date"
             value={formData.terminationDate ? (formData.terminationDate.includes('T') ? formData.terminationDate.split('T')[0] : formData.terminationDate) : ''}
             onChange={(e) => updateFormData('terminationDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
           />
         </div>
       </div>

       <div>
         <Label htmlFor="notes">Notes</Label>
         <Textarea
           id="notes"
           value={formData.notes || ''}
           onChange={(e) => updateFormData('notes', e.target.value)}
           placeholder="Additional notes about the member"
           rows={3}
         />
       </div>

      {/* Contact Numbers Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Contact Numbers</h3>
          <Button type="button" variant="outline" size="sm" onClick={addContactNumber}>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
        

        
        {errors.contactNumbers && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.contactNumbers}</p>
          </div>
        )}

        {formData.contactNumbers.map((contact, index) => (
          <Card key={index} className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact {index + 1}
                  {contact.isPrimary && <Badge variant="secondary" className="ml-2">Primary</Badge>}
                </CardTitle>
                {formData.contactNumbers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContactNumber(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={contact.phoneNumber || ''}
                    onChange={(e) => updateContactNumber(index, 'phoneNumber', e.target.value)}
                    placeholder="09123456789"
                    className={errors[`contactNumbers.${index}.phoneNumber`] ? 'border-red-500' : ''}
                  />
                  {errors[`contactNumbers.${index}.phoneNumber`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`contactNumbers.${index}.phoneNumber`]}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`primary-contact-${index}`}
                    checked={contact.isPrimary}
                    onChange={(e) => updateContactNumber(index, 'isPrimary', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor={`primary-contact-${index}`}>Primary Contact</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* API Error Display */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{apiError}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Addresses</h3>
        <Button type="button" variant="outline" size="sm" onClick={addAddress}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>
      

      
      {errors.addresses && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.addresses}</p>
        </div>
      )}

      {formData.addresses.map((address, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address {index + 1}
                {address.isPrimary && <Badge variant="secondary" className="ml-2">Primary</Badge>}
              </CardTitle>
              {formData.addresses.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAddress(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Address Type</Label>
                <Select value={address.addressType?.toString() || ''} onValueChange={(value) => updateAddress(index, 'addressType', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDRESS_TYPE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`primary-address-${index}`}
                  checked={address.isPrimary}
                  onChange={(e) => updateAddress(index, 'isPrimary', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`primary-address-${index}`}>Primary Address</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Street Address 1</Label>
                <Input
                  value={address.streetAddress1 || ''}
                  onChange={(e) => updateAddress(index, 'streetAddress1', e.target.value)}
                  placeholder="Enter street address"
                  className={errors[`addresses.${index}.streetAddress1`] ? 'border-red-500' : ''}
                />
                {errors[`addresses.${index}.streetAddress1`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`addresses.${index}.streetAddress1`]}</p>
                )}
              </div>
              <div>
                <Label>Street Address 2</Label>
                <Input
                  value={address.streetAddress2 || ''}
                  onChange={(e) => updateAddress(index, 'streetAddress2', e.target.value)}
                  placeholder="Apt, Suite, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-address-${index}`}
                  checked={address.isCurrent}
                  onChange={(e) => updateAddress(index, 'isCurrent', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`current-address-${index}`}>Current Address</Label>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={address.notes || ''}
                onChange={(e) => updateAddress(index, 'notes', e.target.value)}
                placeholder="Additional notes about this address"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  value={address.city || ''}
                  onChange={(e) => updateAddress(index, 'city', e.target.value)}
                  placeholder="City"
                  className={errors[`addresses.${index}.city`] ? 'border-red-500' : ''}
                />
                {errors[`addresses.${index}.city`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`addresses.${index}.city`]}</p>
                )}
              </div>
              <div>
                <Label>Province</Label>
                <Input
                  value={address.province || ''}
                  onChange={(e) => updateAddress(index, 'province', e.target.value)}
                  placeholder="Province"
                  className={errors[`addresses.${index}.province`] ? 'border-red-500' : ''}
                />
                {errors[`addresses.${index}.province`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`addresses.${index}.province`]}</p>
                )}
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input
                  value={address.postalCode || ''}
                  onChange={(e) => updateAddress(index, 'postalCode', e.target.value)}
                  placeholder="Postal Code"
                />
              </div>
            </div>

            <div>
              <Label>Country</Label>
              <Input
                value={address.country || ''}
                onChange={(e) => updateAddress(index, 'country', e.target.value)}
                placeholder="Country"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dependents & Beneficiaries</h3>
        <Button type="button" variant="outline" size="sm" onClick={addDependent}>
          <Plus className="w-4 h-4 mr-2" />
          Add Dependent
        </Button>
      </div>

      {formData.dependents.map((dependent, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Dependent {index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDependent(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={dependent.firstName}
                  onChange={(e) => updateDependent(index, 'firstName', e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div>
                <Label>Middle Name</Label>
                <Input
                  value={dependent.middleName || ''}
                  onChange={(e) => updateDependent(index, 'middleName', e.target.value)}
                  placeholder="Middle Name"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={dependent.lastName}
                  onChange={(e) => updateDependent(index, 'lastName', e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Gender</Label>
                <Select value={dependent.genderType.toString()} onValueChange={(value) => updateDependent(index, 'genderType', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Relationship</Label>
                <Select value={dependent.relationship.toString()} onValueChange={(value) => updateDependent(index, 'relationship', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={dependent.dateOfBirth}
                  onChange={(e) => updateDependent(index, 'dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={dependent.address || ''}
                onChange={(e) => updateDependent(index, 'address', e.target.value)}
                placeholder="Dependent's address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`dependent-${index}`}
                  checked={dependent.isDependent}
                  onChange={(e) => updateDependent(index, 'isDependent', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`dependent-${index}`}>Is Dependent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`beneficiary-${index}`}
                  checked={dependent.isBeneficiary}
                  onChange={(e) => updateDependent(index, 'isBeneficiary', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`beneficiary-${index}`}>Is Beneficiary</Label>
              </div>
            </div>

            {dependent.isBeneficiary && (
              <div>
                <Label>Benefit Types</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {BENEFIT_TYPE_OPTIONS.map(option => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`benefit-${index}-${option.value}`}
                        checked={dependent.benefitTypes.includes(option.value)}
                        onChange={(e) => {
                          const newBenefitTypes = e.target.checked
                            ? [...dependent.benefitTypes, option.value]
                            : dependent.benefitTypes.filter(type => type !== option.value);
                          updateDependent(index, 'benefitTypes', newBenefitTypes);
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`benefit-${index}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Education Background</h3>
        <Button type="button" variant="outline" size="sm" onClick={addEducation}>
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {formData.educations.map((education, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Education {index + 1}
                {education.isHighestAttainment && <Badge variant="secondary" className="ml-2">Highest</Badge>}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Education Attainment Type</Label>
                <Select value={education.educationAttainmentType.toString()} onValueChange={(value) => updateEducation(index, 'educationAttainmentType', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_ATTAINMENT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`highest-education-${index}`}
                  checked={education.isHighestAttainment}
                  onChange={(e) => updateEducation(index, 'isHighestAttainment', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`highest-education-${index}`}>Highest Attainment</Label>
              </div>
            </div>

            <div>
              <Label>School Name</Label>
              <Input
                value={education.schoolName}
                onChange={(e) => updateEducation(index, 'schoolName', e.target.value)}
                placeholder="School/University Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Course/Program</Label>
                <Input
                  value={education.course || ''}
                  onChange={(e) => updateEducation(index, 'course', e.target.value)}
                  placeholder="Course or Program (optional)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Year Started</Label>
                <Input
                  type="number"
                  value={education.yearStarted}
                  onChange={(e) => updateEducation(index, 'yearStarted', parseInt(e.target.value))}
                  placeholder="2020"
                />
              </div>
              <div>
                <Label>Year Completed</Label>
                <Input
                  type="number"
                  value={education.yearCompleted}
                  onChange={(e) => updateEducation(index, 'yearCompleted', parseInt(e.target.value))}
                  placeholder="2024"
                />
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={education.notes || ''}
                onChange={(e) => updateEducation(index, 'notes', e.target.value)}
                placeholder="Additional notes about this education"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Income Sources</h3>
        <Button type="button" variant="outline" size="sm" onClick={addIncome}>
          <Plus className="w-4 h-4 mr-2" />
          Add Income
        </Button>
      </div>

      {formData.incomes.map((income, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Income {index + 1}
                {income.isPrimary && <Badge variant="secondary" className="ml-2">Primary</Badge>}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeIncome(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Income Source</Label>
              <Input
                value={income.source}
                onChange={(e) => updateIncome(index, 'source', e.target.value)}
                placeholder="e.g., Employment - Software Engineer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Income Amount (PHP)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={income.incomeAmount}
                  onChange={(e) => updateIncome(index, 'incomeAmount', parseFloat(e.target.value))}
                  placeholder="50000.00"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`primary-income-${index}`}
                  checked={income.isPrimary}
                  onChange={(e) => updateIncome(index, 'isPrimary', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`primary-income-${index}`}>Primary Income</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      {/* API Error Display */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{apiError}</div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Validation Errors</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Find the first error and navigate to the appropriate step
                    const firstError = Object.keys(errors)[0];
                    if (firstError.includes('firstName') || firstError.includes('lastName') || firstError.includes('dateOfBirth') || firstError.includes('membershipDate') || firstError.includes('contactNumbers')) {
                      setCurrentStep(1);
                    } else if (firstError.includes('addresses')) {
                      setCurrentStep(2);
                    } else if (firstError.includes('dependents')) {
                      setCurrentStep(3);
                    } else if (firstError.includes('educations')) {
                      setCurrentStep(4);
                    } else if (firstError.includes('incomes')) {
                      setCurrentStep(5);
                    }
                  }}
                >
                  Go to First Error
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-4">File Attachments</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <Label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
          </Label>
          <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        
      </div>

      {formData.fileAttachments.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">
            {mode === 'create' ? 'Uploaded Files' : 'File Attachments'} ({formData.fileAttachments.length})
          </h4>
          <div className="space-y-4">
            {formData.fileAttachments.map((file) => (
              <div key={file.id} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{file.name}</p>
                      {!file.file || file.file.size === 0 ? (
                        <Badge variant="outline" className="text-xs">Existing</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                </div>
                <div>
                  <Label htmlFor={`file-description-${file.id}`} className="text-sm font-medium">
                    Description (Optional)
                  </Label>
                  <Input
                    id={`file-description-${file.id}`}
                    value={file.description || ''}
                    onChange={(e) => updateFileDescription(file.id, e.target.value)}
                    placeholder="Enter a description for this file..."
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information & Contacts';
      case 2:
        return 'Addresses';
      case 3:
        return 'Dependents & Beneficiaries';
      case 4:
        return 'Education Background';
      case 5:
        return 'Income Sources';
      case 6:
        return 'File Attachments';
      default:
        return 'Personal Information & Contacts';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {mode === 'create' ? (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create New Member
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Update Member
              </>
            )}
          </DialogTitle>
        </DialogHeader>

                           {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6].map((step) => {
                const isValid = isStepValid(step);
                const isCurrent = step === currentStep;
                const isCompleted = step < currentStep;
                const isAccessible = mode === 'update' || step <= currentStep || (step > currentStep && isValid);
                
                let stepClass = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ';
                
                if (isCurrent) {
                  stepClass += isValid ? 'bg-green-600 text-white' : 'bg-red-500 text-white';
                } else if (isCompleted) {
                  stepClass += 'bg-blue-600 text-white';
                } else if (isAccessible) {
                  stepClass += 'bg-gray-300 text-gray-700 hover:bg-gray-400';
                } else {
                  stepClass += 'bg-gray-200 text-gray-500';
                }
                
                // Add cursor pointer for clickable steps
                if (isAccessible) {
                  stepClass += ' cursor-pointer';
                }
                
                const handleClick = () => {
                  if (isAccessible) {
                    goToStep(step);
                  }
                };
                
                return (
                  <div 
                    key={step} 
                    className={stepClass} 
                    title={
                      isCurrent 
                        ? (isValid ? 'Current step - Valid' : 'Current step - Invalid') 
                        : isCompleted 
                        ? 'Completed step - Click to go back'
                        : isAccessible 
                        ? `Step ${step} - Click to navigate`
                        : 'Complete previous steps first'
                    }
                    onClick={handleClick}
                  >
                    {step}
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 6
              <div className="text-xs text-gray-400 mt-1">
                Use Tab to go to next step, Shift+Tab for previous step, or click on step numbers
              </div>
            </div>
          </div>

        {/* Step Title */}
        <div className="mb-6">
          <h3 className="text-lg font-medium">{getStepTitle()}</h3>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {currentStep < 6 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
                              <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'create' ? 'Creating Member...' : 'Updating Member...'}
                    </>
                  ) : (
                    mode === 'create' ? 'Create Member' : 'Update Member'
                  )}
                </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
