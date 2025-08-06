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
import { 
  CreditCard, 
  Plus, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Building2,
  LogOut,
  Calendar,
  DollarSign,
  FileText,
  Clock
} from 'lucide-react';

interface User {
  username: string;
  role: string;
  name: string;
}

interface Loan {
  id: string;
  loanNumber: string;
  memberNumber: string;
  memberName: string;
  loanType: string;
  amount: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  applicationDate: string;
  approvalDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  purpose: string;
  collateral: string;
  balance: number;
  nextPaymentDate: string;
}

export default function LoansPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newLoan, setNewLoan] = useState({
    memberNumber: '',
    loanType: '',
    amount: '',
    term: '',
    purpose: '',
    collateral: ''
  });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('cooperative-user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/');
    }

    // Load demo loans
    const demoLoans: Loan[] = [
      {
        id: '1',
        loanNumber: 'L001',
        memberNumber: 'M001',
        memberName: 'Juan Dela Cruz',
        loanType: 'Personal Loan',
        amount: 50000,
        interestRate: 12,
        term: 12,
        monthlyPayment: 4500,
        applicationDate: '2024-01-15',
        approvalDate: '2024-01-20',
        status: 'active',
        purpose: 'Home Improvement',
        collateral: 'Certificate of Deposit',
        balance: 40000,
        nextPaymentDate: '2025-02-15'
      },
      {
        id: '2',
        loanNumber: 'L002',
        memberNumber: 'M002',
        memberName: 'Maria Santos',
        loanType: 'Business Loan',
        amount: 100000,
        interestRate: 15,
        term: 24,
        monthlyPayment: 4800,
        applicationDate: '2024-02-01',
        status: 'pending',
        purpose: 'Business Capital',
        collateral: 'Real Estate',
        balance: 100000,
        nextPaymentDate: '2025-02-01'
      },
      {
        id: '3',
        loanNumber: 'L003',
        memberNumber: 'M003',
        memberName: 'Pedro Reyes',
        loanType: 'Emergency Loan',
        amount: 25000,
        interestRate: 10,
        term: 6,
        monthlyPayment: 4400,
        applicationDate: '2024-01-10',
        approvalDate: '2024-01-12',
        status: 'completed',
        purpose: 'Medical Emergency',
        collateral: 'Share Capital',
        balance: 0,
        nextPaymentDate: '2024-12-10'
      }
    ];
    
    setLoans(demoLoans);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cooperative-user');
    router.push('/');
  };

  const handleAddLoan = () => {
    if (!user) return; // Early return if user is null
    
    const loan: Loan = {
      id: Date.now().toString(),
      loanNumber: `L${String(loans.length + 1).padStart(3, '0')}`,
      memberNumber: user.role === 'member' ? 'M002' : newLoan.memberNumber, // Auto-fill for members
      memberName: 'Member Name', // In real app, fetch from member data
      loanType: newLoan.loanType,
      amount: parseFloat(newLoan.amount),
      interestRate: newLoan.loanType === 'Personal Loan' ? 12 : 
                    newLoan.loanType === 'Business Loan' ? 15 : 10,
      term: parseInt(newLoan.term),
      monthlyPayment: calculateMonthlyPayment(parseFloat(newLoan.amount), 12, parseInt(newLoan.term)),
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      purpose: newLoan.purpose,
      collateral: newLoan.collateral,
      balance: parseFloat(newLoan.amount),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setLoans([...loans, loan]);
    setNewLoan({
      memberNumber: user.role === 'member' ? 'M002' : '', // Keep member number for members
      loanType: '',
      amount: '',
      term: '',
      purpose: '',
      collateral: ''
    });
    setIsAddDialogOpen(false);
  };

  const calculateMonthlyPayment = (amount: number, rate: number, term: number) => {
    const monthlyRate = rate / 100 / 12;
    return Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1));
  };

  const handleApprove = (loanId: string) => {
    setLoans(loans.map(loan => 
      loan.id === loanId 
        ? { ...loan, status: 'approved' as const, approvalDate: new Date().toISOString().split('T')[0] }
        : loan
    ));
  };

  const handleReject = (loanId: string) => {
    setLoans(loans.map(loan => 
      loan.id === loanId 
        ? { ...loan, status: 'rejected' as const }
        : loan
    ));
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.memberNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    // Members can only see their own loans
    const matchesRole = user?.role !== 'member' || loan.memberNumber === 'M002'; // Assuming logged in member is M002
    
    return matchesSearch && matchesStatus && matchesRole;
  });

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
                <h1 className="text-xl font-bold text-gray-900">Loan Management</h1>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Loans</p>
                  <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{loans.filter(l => l.status === 'pending').length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{loans.filter(l => l.status === 'active').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-purple-600">₱{loans.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Loans</h2>
            <p className="text-gray-600">
              {user?.role === 'member' ? 'View and apply for loans' : 'Manage loan applications and payments'}
            </p>
          </div>
          {user?.role === 'member' ? (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Apply for Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Loan Application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="memberNumber">Member Number</Label>
                  <Input
                    id="memberNumber"
                    value="M002"
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your member number (automatically filled)</p>
                </div>
                <div>
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select value={newLoan.loanType} onValueChange={(value) => setNewLoan({...newLoan, loanType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                      <SelectItem value="Business Loan">Business Loan</SelectItem>
                      <SelectItem value="Emergency Loan">Emergency Loan</SelectItem>
                      <SelectItem value="Educational Loan">Educational Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50000"
                      value={newLoan.amount}
                      onChange={(e) => setNewLoan({...newLoan, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="term">Term (months)</Label>
                    <Select value={newLoan.term} onValueChange={(value) => setNewLoan({...newLoan, term: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="18">18 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    placeholder="e.g., Home Improvement"
                    value={newLoan.purpose}
                    onChange={(e) => setNewLoan({...newLoan, purpose: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="collateral">Collateral</Label>
                  <Input
                    id="collateral"
                    placeholder="e.g., Certificate of Deposit"
                    value={newLoan.collateral}
                    onChange={(e) => setNewLoan({...newLoan, collateral: e.target.value})}
                  />
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Loan Eligibility Information</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Maximum loan amount: ₱75,000 (based on your share capital and savings)</p>
                    <p>• Interest rates: Personal (12%), Business (15%), Emergency (10%)</p>
                    <p>• Processing time: 3-5 business days</p>
                    <p>• Required: Valid ID, proof of income, collateral documentation</p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLoan}>
                    Submit Application
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          ) : (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Loan Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Loan Application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="memberNumber">Member Number</Label>
                  <Input
                    id="memberNumber"
                    placeholder="Enter member number (e.g., M001)"
                    value={newLoan.memberNumber}
                    onChange={(e) => setNewLoan({...newLoan, memberNumber: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select value={newLoan.loanType} onValueChange={(value) => setNewLoan({...newLoan, loanType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                      <SelectItem value="Business Loan">Business Loan</SelectItem>
                      <SelectItem value="Emergency Loan">Emergency Loan</SelectItem>
                      <SelectItem value="Educational Loan">Educational Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50000"
                      value={newLoan.amount}
                      onChange={(e) => setNewLoan({...newLoan, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="term">Term (months)</Label>
                    <Select value={newLoan.term} onValueChange={(value) => setNewLoan({...newLoan, term: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="18">18 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    placeholder="e.g., Home Improvement"
                    value={newLoan.purpose}
                    onChange={(e) => setNewLoan({...newLoan, purpose: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="collateral">Collateral</Label>
                  <Input
                    id="collateral"
                    placeholder="e.g., Certificate of Deposit"
                    value={newLoan.collateral}
                    onChange={(e) => setNewLoan({...newLoan, collateral: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLoan}>
                    Submit Application
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search loans..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loans Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              {user.role === 'member' ? 'My Loans' : 'All Loans'} ({filteredLoans.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Loan #</th>
                    <th className="text-left p-3">Member</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Balance</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan) => (
                    <tr key={loan.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{loan.loanNumber}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{loan.memberName}</p>
                          <p className="text-sm text-gray-600">{loan.memberNumber}</p>
                        </div>
                      </td>
                      <td className="p-3">{loan.loanType}</td>
                      <td className="p-3">₱{loan.amount.toLocaleString()}</td>
                      <td className="p-3">
                        <Badge variant={
                          loan.status === 'approved' || loan.status === 'active' ? 'default' :
                          loan.status === 'pending' ? 'secondary' :
                          loan.status === 'completed' ? 'outline' : 'destructive'
                        }>
                          {loan.status}
                        </Badge>
                      </td>
                      <td className="p-3">₱{loan.balance.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {loan.status === 'pending' && (user.role === 'admin' || user.role === 'staff') && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(loan.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(loan.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
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

        {/* View Loan Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Loan Details</DialogTitle>
            </DialogHeader>
            {selectedLoan && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Loan Number</Label>
                    <p className="text-lg font-medium">{selectedLoan.loanNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge variant={
                      selectedLoan.status === 'approved' || selectedLoan.status === 'active' ? 'default' :
                      selectedLoan.status === 'pending' ? 'secondary' :
                      selectedLoan.status === 'completed' ? 'outline' : 'destructive'
                    }>
                      {selectedLoan.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Member</Label>
                    <p className="text-lg">{selectedLoan.memberName}</p>
                    <p className="text-sm text-gray-600">{selectedLoan.memberNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Loan Type</Label>
                    <p className="text-lg">{selectedLoan.loanType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Amount</Label>
                    <p className="text-2xl font-bold text-blue-600">₱{selectedLoan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Balance</Label>
                    <p className="text-2xl font-bold text-red-600">₱{selectedLoan.balance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Interest Rate</Label>
                    <p className="text-lg font-medium">{selectedLoan.interestRate}%</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Term</Label>
                    <p className="text-lg font-medium">{selectedLoan.term} months</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Monthly Payment</Label>
                    <p className="text-lg font-medium">₱{selectedLoan.monthlyPayment.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium">Purpose: </span>
                      <span>{selectedLoan.purpose}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium">Application Date: </span>
                      <span>{new Date(selectedLoan.applicationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {selectedLoan.approvalDate && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium">Approval Date: </span>
                        <span>{new Date(selectedLoan.approvalDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-sm font-medium">Collateral: </span>
                      <span>{selectedLoan.collateral}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}