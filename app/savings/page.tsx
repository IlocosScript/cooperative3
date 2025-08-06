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
  PiggyBank, 
  Plus, 
  Search, 
  Eye, 
  ArrowLeft,
  Building2,
  LogOut,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign
} from 'lucide-react';

interface User {
  username: string;
  role: string;
  name: string;
}

interface SavingsAccount {
  id: string;
  accountNumber: string;
  memberNumber: string;
  memberName: string;
  accountType: string;
  balance: number;
  interestRate: number;
  dateOpened: string;
  status: 'active' | 'inactive' | 'closed';
  lastTransaction: string;
  minimumBalance: number;
}

interface Transaction {
  id: string;
  accountNumber: string;
  type: 'deposit' | 'withdrawal' | 'interest';
  amount: number;
  date: string;
  description: string;
  balance: number;
}

export default function SavingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    memberNumber: '',
    accountType: '',
    initialDeposit: ''
  });
  const [newTransaction, setNewTransaction] = useState({
    type: 'deposit' as 'deposit' | 'withdrawal',
    amount: '',
    description: ''
  });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('cooperative-user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/');
    }

    // Load demo savings accounts
    const demoAccounts: SavingsAccount[] = [
      {
        id: '1',
        accountNumber: 'SA001',
        memberNumber: 'M001',
        memberName: 'Juan Dela Cruz',
        accountType: 'Regular Savings',
        balance: 25000,
        interestRate: 2.5,
        dateOpened: '2024-01-15',
        status: 'active',
        lastTransaction: '2025-01-10',
        minimumBalance: 1000
      },
      {
        id: '2',
        accountNumber: 'SA002',
        memberNumber: 'M002',
        memberName: 'Maria Santos',
        accountType: 'Time Deposit',
        balance: 35000,
        interestRate: 4.0,
        dateOpened: '2024-02-10',
        status: 'active',
        lastTransaction: '2025-01-15',
        minimumBalance: 5000
      },
      {
        id: '3',
        accountNumber: 'SA003',
        memberNumber: 'M003',
        memberName: 'Pedro Reyes',
        accountType: 'Regular Savings',
        balance: 10000,
        interestRate: 2.5,
        dateOpened: '2024-03-05',
        status: 'active',
        lastTransaction: '2024-12-20',
        minimumBalance: 1000
      }
    ];
    
    setAccounts(demoAccounts);

    // Load demo transactions
    const demoTransactions: Transaction[] = [
      {
        id: '1',
        accountNumber: 'SA002',
        type: 'deposit',
        amount: 5000,
        date: '2025-01-15',
        description: 'Monthly savings deposit',
        balance: 35000
      },
      {
        id: '2',
        accountNumber: 'SA002',
        type: 'interest',
        amount: 116,
        date: '2025-01-01',
        description: 'Monthly interest credit',
        balance: 30116
      },
      {
        id: '3',
        accountNumber: 'SA002',
        type: 'deposit',
        amount: 10000,
        date: '2024-12-15',
        description: 'Salary deposit',
        balance: 30000
      }
    ];
    
    setTransactions(demoTransactions);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cooperative-user');
    router.push('/');
  };

  const handleAddAccount = () => {
    const account: SavingsAccount = {
      id: Date.now().toString(),
      accountNumber: `SA${String(accounts.length + 1).padStart(3, '0')}`,
      memberNumber: user?.role === 'member' ? 'M002' : newAccount.memberNumber,
      memberName: 'Member Name', // In real app, fetch from member data
      accountType: newAccount.accountType,
      balance: parseFloat(newAccount.initialDeposit),
      interestRate: newAccount.accountType === 'Time Deposit' ? 4.0 : 2.5,
      dateOpened: new Date().toISOString().split('T')[0],
      status: 'active',
      lastTransaction: new Date().toISOString().split('T')[0],
      minimumBalance: newAccount.accountType === 'Time Deposit' ? 5000 : 1000
    };
    
    setAccounts([...accounts, account]);
    setNewAccount({
      memberNumber: user?.role === 'member' ? 'M002' : '',
      accountType: '',
      initialDeposit: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleTransaction = () => {
    if (!selectedAccount) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      accountNumber: selectedAccount.accountNumber,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      date: new Date().toISOString().split('T')[0],
      description: newTransaction.description,
      balance: newTransaction.type === 'deposit' 
        ? selectedAccount.balance + parseFloat(newTransaction.amount)
        : selectedAccount.balance - parseFloat(newTransaction.amount)
    };

    // Update account balance
    setAccounts(accounts.map(acc => 
      acc.id === selectedAccount.id 
        ? { ...acc, balance: transaction.balance, lastTransaction: transaction.date }
        : acc
    ));

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      type: 'deposit',
      amount: '',
      description: ''
    });
    setIsTransactionDialogOpen(false);
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.memberNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Members can only see their own accounts
    const matchesRole = user?.role !== 'member' || account.memberNumber === 'M002';
    
    return matchesSearch && matchesRole;
  });

  const memberTransactions = transactions.filter(t => 
    user?.role === 'member' ? t.accountNumber === 'SA002' : true
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
                <h1 className="text-xl font-bold text-gray-900">Savings Management</h1>
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
                  <p className="text-sm font-medium text-gray-600">
                    {user.role === 'member' ? 'My Accounts' : 'Total Accounts'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{filteredAccounts.length}</p>
                </div>
                <PiggyBank className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {user.role === 'member' ? 'My Balance' : 'Total Balance'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₱{filteredAccounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredAccounts.filter(acc => acc.status === 'active').length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Interest Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredAccounts.length > 0 
                      ? (filteredAccounts.reduce((sum, acc) => sum + acc.interestRate, 0) / filteredAccounts.length).toFixed(1)
                      : '0'}%
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.role === 'member' ? 'My Savings Accounts' : 'Savings Accounts'}
            </h2>
            <p className="text-gray-600">
              {user.role === 'member' 
                ? 'View your savings accounts and transaction history' 
                : 'Manage member savings accounts and transactions'
              }
            </p>
          </div>
          {(user.role === 'admin' || user.role === 'staff') && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Savings Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Savings Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="memberNumber">Member Number</Label>
                    <Input
                      id="memberNumber"
                      placeholder="Enter member number (e.g., M001)"
                      value={newAccount.memberNumber}
                      onChange={(e) => setNewAccount({...newAccount, memberNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select value={newAccount.accountType} onValueChange={(value) => setNewAccount({...newAccount, accountType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular Savings">Regular Savings (2.5% interest)</SelectItem>
                        <SelectItem value="Time Deposit">Time Deposit (4.0% interest)</SelectItem>
                        <SelectItem value="Christmas Savings">Christmas Savings (3.0% interest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="initialDeposit">Initial Deposit</Label>
                    <Input
                      id="initialDeposit"
                      type="number"
                      placeholder="Minimum: ₱1,000"
                      value={newAccount.initialDeposit}
                      onChange={(e) => setNewAccount({...newAccount, initialDeposit: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAccount}>
                      Create Account
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search */}
        {user.role !== 'member' && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accounts..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Accounts Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PiggyBank className="w-5 h-5 mr-2" />
              {user.role === 'member' ? 'My Accounts' : 'All Accounts'} ({filteredAccounts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Account #</th>
                    {user.role !== 'member' && <th className="text-left p-3">Member</th>}
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Balance</th>
                    <th className="text-left p-3">Interest Rate</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{account.accountNumber}</td>
                      {user.role !== 'member' && (
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{account.memberName}</p>
                            <p className="text-sm text-gray-600">{account.memberNumber}</p>
                          </div>
                        </td>
                      )}
                      <td className="p-3">{account.accountType}</td>
                      <td className="p-3 font-medium">₱{account.balance.toLocaleString()}</td>
                      <td className="p-3">{account.interestRate}%</td>
                      <td className="p-3">
                        <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                          {account.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAccount(account);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {(user.role === 'admin' || user.role === 'staff') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAccount(account);
                                setIsTransactionDialogOpen(true);
                              }}
                            >
                              <Plus className="w-4 h-4" />
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

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {user.role === 'member' ? 'My Recent Transactions' : 'Recent Transactions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberTransactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-100' :
                      transaction.type === 'withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {transaction.type === 'deposit' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                       transaction.type === 'withdrawal' ? <TrendingDown className="w-4 h-4 text-red-600" /> :
                       <DollarSign className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-600">
                        {transaction.accountNumber} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'deposit' || transaction.type === 'interest' 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'interest' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">Balance: ₱{transaction.balance.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* View Account Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Account Details</DialogTitle>
            </DialogHeader>
            {selectedAccount && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                    <p className="text-lg font-medium">{selectedAccount.accountNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge variant={selectedAccount.status === 'active' ? 'default' : 'secondary'}>
                      {selectedAccount.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Account Holder</Label>
                    <p className="text-lg">{selectedAccount.memberName}</p>
                    <p className="text-sm text-gray-600">{selectedAccount.memberNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Account Type</Label>
                    <p className="text-lg">{selectedAccount.accountType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Current Balance</Label>
                    <p className="text-2xl font-bold text-green-600">₱{selectedAccount.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Interest Rate</Label>
                    <p className="text-2xl font-bold text-blue-600">{selectedAccount.interestRate}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date Opened</Label>
                    <p className="text-lg">{new Date(selectedAccount.dateOpened).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Last Transaction</Label>
                    <p className="text-lg">{new Date(selectedAccount.lastTransaction).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Minimum Balance</Label>
                  <p className="text-lg">₱{selectedAccount.minimumBalance.toLocaleString()}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Transaction Dialog */}
        <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            {selectedAccount && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedAccount.accountNumber} - {selectedAccount.memberName}</p>
                  <p className="text-sm text-gray-600">Current Balance: ₱{selectedAccount.balance.toLocaleString()}</p>
                </div>
                
                <div>
                  <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select value={newTransaction.type} onValueChange={(value: 'deposit' | 'withdrawal') => setNewTransaction({...newTransaction, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Transaction description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTransaction}>
                    Process Transaction
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}