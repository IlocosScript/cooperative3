'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  ArrowLeft,
  Building2,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  PiggyBank,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Member, MembersQueryParams, getStatusLabel, getStatusVariant, getMembershipTypeLabel, getGenderLabel, getCivilStatusLabel } from '@/lib/types/members';
import MembersApiService from '@/lib/services/membersApi';

interface User {
  username: string;
  role: string;
  name: string;
}

export default function MembersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<number | undefined>();
  const [membershipTypeFilter, setMembershipTypeFilter] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<'firstName' | 'lastName' | 'memberNumber' | 'dateOfBirth' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [newMember, setNewMember] = useState<Partial<Member>>({
    FirstName: '',
    LastName: '',
    MiddleName: '',
    DateOfBirth: '',
    GenderType: 1,
    CivilStatus: 1,
    Status: 1,
    MembershipType: 1,
    PrimaryAddress: '',
    PrimaryContactNumber: ''
  });
  const router = useRouter();

  // Function to fetch members from API
  const fetchMembers = async (params: MembersQueryParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    const apiParams = {
      page: currentPage,
      pageSize,
      searchTerm,
      status: statusFilter,
      membershipType: membershipTypeFilter,
      sortBy,
      sortDirection,
      ...params
    };
    
    console.log('API Parameters being sent:', apiParams);
    
    try {
      const response = await MembersApiService.getMembers(apiParams);
      
      console.log('API Response:', response);
      console.log('Members data:', response.data.items);
      console.log('First member structure:', response.data.items?.[0]);
      console.log('First member keys:', response.data.items?.[0] ? Object.keys(response.data.items[0]) : 'No members');
      console.log('Total count:', response.data.totalCount);
      console.log('Page size requested:', pageSize);
      console.log('Current page:', currentPage);
      console.log('Total pages:', response.data.totalPages);
      console.log('Has next page:', response.data.hasNextPage);
      console.log('Has previous page:', response.data.hasPreviousPage);
      console.log('Number of members returned:', response.data.items?.length || 0);
      
      setMembers(response.data.items || []);
      
      setTotalCount(response.data.totalCount || 0);
      setTotalPages(response.data.totalPages || 0);
      setHasNextPage(response.data.hasNextPage || false);
      setHasPreviousPage(response.data.hasPreviousPage || false);
     
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
      console.error('Error fetching members:', err);
      setMembers([]);
      setTotalCount(0);
      setTotalPages(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setIsLoading(false);
      console.log('Members:',members);  
    }
  };

  // Fetch members when component mounts or filters change
  useEffect(() => {
    const userData = localStorage.getItem('cooperative-user');
    if (userData) {
      setUser(JSON.parse(userData));
      console.log('Starting to fetch members...');
      fetchMembers();
    } else {
      router.push('/');
    }
  }, [currentPage, pageSize, searchTerm, statusFilter, membershipTypeFilter, sortBy, sortDirection]);

  // Debounced search effect
  useEffect(() => {
    setIsSearching(true);
    
    const timer = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(1); // Reset to first page when searching
        fetchMembers({ searchTerm });
      } else {
        fetchMembers();
      }
      setIsSearching(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('cooperative-user');
    router.push('/');
  };

  const handleAddMember = async () => {
    try {
      setIsLoading(true);
      await MembersApiService.createMember(newMember);
      
      // Reset form
      setNewMember({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        genderType: 1,
        civilStatus: 1,
        status: 1,
        membershipType: 1,
        primaryAddress: '',
        primaryContactNumber: ''
      });
      setIsAddDialogOpen(false);
      
      // Refresh members list
      fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member');
      console.error('Error adding member:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSort = (field: 'firstName' | 'lastName' | 'memberNumber' | 'dateOfBirth' | 'createdAt') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="bg-green-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Member Management</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'member' ? (
          // Member Profile View
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
              <p className="text-gray-600">View and manage your member information</p>
            </div>

            {/* Member's own profile */}
            {(() => {
              const memberProfile = members && members.length > 0 ? members.find(m => m.memberNumber === 'M002') : null; // Assuming logged in member is M002
              console.log('Member profile found:', memberProfile);
              return memberProfile ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Member Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Member Number</Label>
                          <p className="text-lg font-medium">{memberProfile.memberNumber}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Status</Label>
                          <Badge variant={getStatusVariant(memberProfile.status)}>
                            {getStatusLabel(memberProfile.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                          <p className="text-lg">{memberProfile.fullName}</p>
                          {memberProfile.middleName && (
                            <p className="text-sm text-gray-500">Middle Name: {memberProfile.middleName}</p>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Age</Label>
                          <p className="text-lg">{memberProfile.age} years old</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Gender</Label>
                          <p className="text-lg">{getGenderLabel(memberProfile.genderType)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Civil Status</Label>
                          <p className="text-lg">{getCivilStatusLabel(memberProfile.civilStatus)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Membership Type</Label>
                          <Badge variant="outline">
                            {getMembershipTypeLabel(memberProfile.membershipType)}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
                          <p className="text-lg">{new Date(memberProfile.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{memberProfile.primaryContactNumber}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{memberProfile.primaryAddress}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Joined: {new Date(memberProfile.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Label className="text-sm font-medium text-gray-600">Member ID</Label>
                        <p className="text-sm text-gray-500">#{memberProfile.id}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null;
            })()}
          </div>
        ) : (
          // Admin/Staff Member Management View
          <>
            {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Members</h2>
            <p className="text-gray-600">Manage your cooperative members</p>
          </div>
          {(user.role === 'admin' || user.role === 'staff') && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newMember.firstName}
                      onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={newMember.middleName || ''}
                      onChange={(e) => setNewMember({...newMember, middleName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newMember.lastName}
                      onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
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
                      value={newMember.dateOfBirth}
                      onChange={(e) => setNewMember({...newMember, dateOfBirth: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="genderType">Gender *</Label>
                    <Select value={newMember.genderType?.toString()} onValueChange={(value) => setNewMember({...newMember, genderType: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Male</SelectItem>
                        <SelectItem value="2">Female</SelectItem>
                        <SelectItem value="3">Non-Binary</SelectItem>
                        <SelectItem value="4">Prefer Not to Say</SelectItem>
                        <SelectItem value="5">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="civilStatus">Civil Status *</Label>
                    <Select value={newMember.civilStatus?.toString()} onValueChange={(value) => setNewMember({...newMember, civilStatus: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select civil status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Single</SelectItem>
                        <SelectItem value="2">Married</SelectItem>
                        <SelectItem value="3">Widowed</SelectItem>
                        <SelectItem value="4">Divorced</SelectItem>
                        <SelectItem value="5">Separated</SelectItem>
                        <SelectItem value="6">Domestic Partnership</SelectItem>
                        <SelectItem value="7">Annulled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="membershipType">Membership Type *</Label>
                    <Select value={newMember.membershipType?.toString()} onValueChange={(value) => setNewMember({...newMember, membershipType: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select membership type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="primaryAddress">Primary Address *</Label>
                  <Textarea
                    id="primaryAddress"
                    value={newMember.primaryAddress}
                    onChange={(e) => setNewMember({...newMember, primaryAddress: e.target.value})}
                    placeholder="Enter complete address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="primaryContactNumber">Primary Contact Number *</Label>
                  <Input
                    id="primaryContactNumber"
                    value={newMember.primaryContactNumber}
                    onChange={(e) => setNewMember({...newMember, primaryContactNumber: e.target.value})}
                    placeholder="+63 912 345 6789"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Member'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members by name or member number..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <Select 
              value={statusFilter?.toString() || "all"} 
              onValueChange={(value) => setStatusFilter(value === "all" ? undefined : parseInt(value))}
              disabled={isSearching}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="0">Pending Status</SelectItem>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="2">Inactive</SelectItem>
                <SelectItem value="3">Suspended</SelectItem>
                <SelectItem value="4">Pending</SelectItem>
                <SelectItem value="5">Terminated</SelectItem>
                <SelectItem value="6">On Hold</SelectItem>
                <SelectItem value="7">Probationary</SelectItem>
                <SelectItem value="8">Honorary</SelectItem>
                <SelectItem value="9">Deceased</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={membershipTypeFilter?.toString() || "all"} 
              onValueChange={(value) => setMembershipTypeFilter(value === "all" ? undefined : parseInt(value))}
              disabled={isSearching}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="1">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isSearching && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Searching...</span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                All Members ({totalCount})
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Show:</Label>
                <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading members...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th 
                          className="text-left p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('memberNumber')}
                        >
                          Member #
                          {sortBy === 'memberNumber' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th 
                          className="text-left p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('firstName')}
                        >
                          Name
                          {sortBy === 'firstName' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">Age</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Type</th>
                        <th 
                          className="text-left p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort('createdAt')}
                        >
                          Joined
                          {sortBy === 'createdAt' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members && members.length > 0 ? members.map((member) => (
                        <tr key={member.Id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{member.MemberNumber || 'N/A'}</td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">
                                {member.FullName || `${member.FirstName || ''} ${member.LastName || ''}`.trim() || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.MiddleName && `${member.MiddleName} • `}
                                {member.GenderType ? getGenderLabel(member.GenderType) : 'N/A'} • {member.CivilStatus ? getCivilStatusLabel(member.CivilStatus) : 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div>{member.PrimaryContactNumber || 'N/A'}</div>
                              <div className="text-gray-500">{member.PrimaryAddress || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="p-3">{member.Age ? `${member.Age} years` : 'N/A'}</td>
                          <td className="p-3">
                            <Badge variant={member.Status ? getStatusVariant(member.Status) : 'secondary'}>
                              {member.Status ? getStatusLabel(member.Status) : 'N/A'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {member.MembershipType ? getMembershipTypeLabel(member.MembershipType) : 'N/A'}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {member.CreatedAt ? new Date(member.CreatedAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  console.log('Selected member data:', member);
                                  setSelectedMember(member);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {(user.role === 'admin' || user.role === 'staff') && (
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-gray-500">
                            {isLoading ? 'Loading members...' : 'No members found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} members
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPreviousPage}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-8 h-8"
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
          </>
        )}

        {/* View Member Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Member Number</Label>
                    <p className="text-lg font-medium">{selectedMember.MemberNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge variant={getStatusVariant(selectedMember.Status)}>
                      {getStatusLabel(selectedMember.Status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                    <p className="text-lg">{selectedMember.FullName}</p>
                    {selectedMember.FullName && (
                      <p className="text-sm text-gray-500">Middle Name: {selectedMember.MiddleName}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Age</Label>
                    <p className="text-lg">{selectedMember.Age} years old</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Gender</Label>
                    <p className="text-lg">{getGenderLabel(selectedMember.GenderType)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Civil Status</Label>
                    <p className="text-lg">{getCivilStatusLabel(selectedMember.CivilStatus)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Membership Type</Label>
                    <Badge variant="outline">
                      {getMembershipTypeLabel(selectedMember.MembershipType)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
                    <p className="text-lg">{new Date(selectedMember.DateOfBirth).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedMember.primaryContactNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedMember.primaryAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined: {new Date(selectedMember.Memb).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-gray-600">Member ID</Label>
                  <p className="text-sm text-gray-500">#{selectedMember.id}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}