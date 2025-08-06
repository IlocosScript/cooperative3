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
  PiggyBank
} from 'lucide-react';

interface User {
  username: string;
  role: string;
  name: string;
}

interface Member {
  id: string;
  memberNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateJoined: string;
  status: 'active' | 'inactive';
  shareCapital: number;
  savings: number;
  loans: number;
  occupation: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export default function MembersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('cooperative-user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/');
    }

    // Load demo members
    const demoMembers: Member[] = [
      {
        id: '1',
        memberNumber: 'M001',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        email: 'juan@email.com',
        phone: '+63 912 345 6789',
        address: '123 Main St, Manila',
        dateJoined: '2024-01-15',
        status: 'active',
        shareCapital: 10000,
        savings: 25000,
        loans: 50000,
        occupation: 'Teacher',
        emergencyContact: 'Maria Dela Cruz',
        emergencyPhone: '+63 912 345 6780'
      },
      {
        id: '2',
        memberNumber: 'M002',
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria@email.com',
        phone: '+63 912 345 6790',
        address: '456 Oak Ave, Quezon City',
        dateJoined: '2024-02-10',
        status: 'active',
        shareCapital: 15000,
        savings: 35000,
        loans: 0,
        occupation: 'Nurse',
        emergencyContact: 'Pedro Santos',
        emergencyPhone: '+63 912 345 6791'
      },
      {
        id: '3',
        memberNumber: 'M003',
        firstName: 'Pedro',
        lastName: 'Reyes',
        email: 'pedro@email.com',
        phone: '+63 912 345 6792',
        address: '789 Pine Rd, Makati',
        dateJoined: '2024-03-05',
        status: 'inactive',
        shareCapital: 5000,
        savings: 10000,
        loans: 25000,
        occupation: 'Driver',
        emergencyContact: 'Ana Reyes',
        emergencyPhone: '+63 912 345 6793'
      }
    ];
    
    setMembers(demoMembers);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cooperative-user');
    router.push('/');
  };

  const handleAddMember = () => {
    const member: Member = {
      id: Date.now().toString(),
      memberNumber: `M${String(members.length + 1).padStart(3, '0')}`,
      firstName: newMember.firstName || '',
      lastName: newMember.lastName || '',
      email: newMember.email || '',
      phone: newMember.phone || '',
      address: newMember.address || '',
      dateJoined: new Date().toISOString().split('T')[0],
      status: 'active',
      shareCapital: 5000,
      savings: 0,
      loans: 0,
      occupation: newMember.occupation || '',
      emergencyContact: newMember.emergencyContact || '',
      emergencyPhone: newMember.emergencyPhone || ''
    };
    
    setMembers([...members, member]);
    setNewMember({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      occupation: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
    setIsAddDialogOpen(false);
  };

  const filteredMembers = members.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              const memberProfile = members.find(m => m.memberNumber === 'M002'); // Assuming logged in member is M002
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
                          <Badge variant={memberProfile.status === 'active' ? 'default' : 'secondary'}>
                            {memberProfile.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Name</Label>
                          <p className="text-lg">{memberProfile.firstName} {memberProfile.lastName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Occupation</Label>
                          <p className="text-lg">{memberProfile.occupation}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{memberProfile.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{memberProfile.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{memberProfile.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Joined: {new Date(memberProfile.dateJoined).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Share Capital</p>
                            <p className="text-xl font-bold">₱{memberProfile.shareCapital.toLocaleString()}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <PiggyBank className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Savings</p>
                            <p className="text-xl font-bold">₱{memberProfile.savings.toLocaleString()}</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <CreditCard className="w-8 h-8 text-red-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Outstanding Loans</p>
                            <p className="text-xl font-bold">₱{memberProfile.loans.toLocaleString()}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-600">Emergency Contact</Label>
                        <p className="text-lg">{memberProfile.emergencyContact}</p>
                        <p className="text-sm text-gray-600">{memberProfile.emergencyPhone}</p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newMember.firstName}
                      onChange={(e) => setNewMember({...newMember, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newMember.lastName}
                      onChange={(e) => setNewMember({...newMember, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newMember.address}
                    onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={newMember.occupation}
                    onChange={(e) => setNewMember({...newMember, occupation: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={newMember.emergencyContact}
                      onChange={(e) => setNewMember({...newMember, emergencyContact: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={newMember.emergencyPhone}
                      onChange={(e) => setNewMember({...newMember, emergencyPhone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddMember}>
                    Add Member
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              All Members ({filteredMembers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Member #</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Share Capital</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{member.memberNumber}</td>
                      <td className="p-3">{member.firstName} {member.lastName}</td>
                      <td className="p-3">{member.email}</td>
                      <td className="p-3">{member.phone}</td>
                      <td className="p-3">
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                      </td>
                      <td className="p-3">₱{member.shareCapital.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
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
                  ))}
                </tbody>
              </table>
            </div>
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
                    <p className="text-lg font-medium">{selectedMember.memberNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge variant={selectedMember.status === 'active' ? 'default' : 'secondary'}>
                      {selectedMember.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Name</Label>
                    <p className="text-lg">{selectedMember.firstName} {selectedMember.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Occupation</Label>
                    <p className="text-lg">{selectedMember.occupation}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedMember.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedMember.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedMember.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined: {new Date(selectedMember.dateJoined).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Share Capital</p>
                      <p className="text-xl font-bold">₱{selectedMember.shareCapital.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <PiggyBank className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Savings</p>
                      <p className="text-xl font-bold">₱{selectedMember.savings.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CreditCard className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Loans</p>
                      <p className="text-xl font-bold">₱{selectedMember.loans.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Emergency Contact</Label>
                  <p className="text-lg">{selectedMember.emergencyContact}</p>
                  <p className="text-sm text-gray-600">{selectedMember.emergencyPhone}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}