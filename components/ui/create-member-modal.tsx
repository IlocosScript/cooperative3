'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  getEducationAttainmentTypeLabel
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
  onSubmit?: (data: CreateMemberData) => void;
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

export default function CreateMemberModal({ isOpen, onClose, onSubmit }: CreateMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateMemberData>({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    birthplace: '',
    genderType: 1,
    civilStatus: 1,
    tin: '',
    bodNumber: '',
    status: 0,
    membershipType: 1,
    membershipDate: new Date().toISOString(),
    terminationDate: '',
    notes: '',
    addresses: [
      {
        addressType: 1,
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments: FileAttachment[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file
      }));
      
      setFormData(prev => ({
        ...prev,
        fileAttachments: [...prev.fileAttachments, ...newAttachments]
      }));
    }
  };

  const removeFile = (id: string) => {
    setFormData(prev => ({
      ...prev,
      fileAttachments: prev.fileAttachments.filter(file => file.id !== id)
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
    setIsLoading(true);
    try {
      // Temporary submit function - just log the data
      console.log('Submitting member data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
             // Reset form and close modal
       setFormData({
         firstName: '',
         lastName: '',
         middleName: '',
         dateOfBirth: '',
         birthplace: '',
         genderType: 1,
         civilStatus: 1,
         tin: '',
         bodNumber: '',
         status: 0,
         membershipType: 1,
         membershipDate: new Date().toISOString(),
         terminationDate: '',
         notes: '',
         addresses: [
           {
             addressType: 1,
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
      onClose();
    } catch (error) {
      console.error('Error creating member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            value={formData.middleName}
            onChange={(e) => updateFormData('middleName', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="birthplace">Birthplace</Label>
          <Input
            id="birthplace"
            value={formData.birthplace}
            onChange={(e) => updateFormData('birthplace', e.target.value)}
            placeholder="e.g., Manila, Philippines"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="genderType">Gender *</Label>
          <Select value={formData.genderType.toString()} onValueChange={(value) => updateFormData('genderType', parseInt(value))}>
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
          <Select value={formData.civilStatus.toString()} onValueChange={(value) => updateFormData('civilStatus', parseInt(value))}>
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
            value={formData.tin}
            onChange={(e) => updateFormData('tin', e.target.value)}
            placeholder="123456789"
          />
        </div>
      </div>

             <div className="grid grid-cols-2 gap-4">
         <div>
           <Label htmlFor="membershipType">Membership Type *</Label>
           <Select value={formData.membershipType.toString()} onValueChange={(value) => updateFormData('membershipType', parseInt(value))}>
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
           <Label htmlFor="bodNumber">BOD Number</Label>
           <Input
             id="bodNumber"
             value={formData.bodNumber}
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
             value={formData.membershipDate.split('T')[0]}
             onChange={(e) => updateFormData('membershipDate', new Date(e.target.value).toISOString())}
             required
           />
         </div>
         <div>
           <Label htmlFor="terminationDate">Termination Date</Label>
           <Input
             id="terminationDate"
             type="date"
             value={formData.terminationDate ? formData.terminationDate.split('T')[0] : ''}
             onChange={(e) => updateFormData('terminationDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
           />
         </div>
       </div>

       <div>
         <Label htmlFor="notes">Notes</Label>
         <Textarea
           id="notes"
           value={formData.notes}
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
                    value={contact.phoneNumber}
                    onChange={(e) => updateContactNumber(index, 'phoneNumber', e.target.value)}
                    placeholder="09123456789"
                  />
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Addresses</h3>
        <Button type="button" variant="outline" size="sm" onClick={addAddress}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

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
                <Select value={address.addressType.toString()} onValueChange={(value) => updateAddress(index, 'addressType', parseInt(value))}>
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
                   value={address.streetAddress1}
                   onChange={(e) => updateAddress(index, 'streetAddress1', e.target.value)}
                   placeholder="Enter street address"
                 />
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
                  value={address.city}
                  onChange={(e) => updateAddress(index, 'city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <Label>Province</Label>
                <Input
                  value={address.province}
                  onChange={(e) => updateAddress(index, 'province', e.target.value)}
                  placeholder="Province"
                />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input
                  value={address.postalCode}
                  onChange={(e) => updateAddress(index, 'postalCode', e.target.value)}
                  placeholder="Postal Code"
                />
              </div>
            </div>

            <div>
              <Label>Country</Label>
              <Input
                value={address.country}
                onChange={(e) => updateAddress(index, 'country', e.target.value)}
                placeholder="Country"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dependents</h3>
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

            <div className="grid grid-cols-2 gap-4">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStep3 = () => (
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

  const renderStep4 = () => (
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

  const renderStep5 = () => (
    <div className="space-y-6">
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
          <h4 className="text-md font-medium mb-3">Uploaded Files</h4>
          <div className="space-y-2">
            {formData.fileAttachments.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
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
      default:
        return renderStep1();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Information & Contacts';
      case 2:
        return 'Addresses & Dependents';
      case 3:
        return 'Education Background';
      case 4:
        return 'Income Sources';
      case 5:
        return 'File Attachments';
      default:
        return 'Personal Information & Contacts';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Create New Member
          </DialogTitle>
        </DialogHeader>

                           {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of 5
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
              {currentStep < 5 ? (
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
                      Creating Member...
                    </>
                  ) : (
                    'Create Member'
                  )}
                </Button>
              )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
