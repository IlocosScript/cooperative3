'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ArrowLeft,
  Building2,
  LogOut,
  Users,
  CreditCard,
  PiggyBank,
  DollarSign,
  Calendar,
  FileText,
  Download,
  BarChart3,
  PieChart
} from 'lucide-react';

interface User {
  username: string;
  role: string;
  name: string;
}

export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('cooperative-user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cooperative-user');
    router.push('/');
  };

  if (!user) return <div>Loading...</div>;

  const financialData = {
    totalMembers: 1247,
    activeMembers: 1180,
    totalSavings: 2850000,
    totalLoans: 1750000,
    shareCapital: 1200000,
    monthlyIncome: 450000,
    monthlyExpenses: 320000,
    netIncome: 130000
  };

  const monthlyData = [
    { month: 'Jan', income: 420000, expenses: 300000, savings: 2650000, loans: 1600000 },
    { month: 'Feb', income: 435000, expenses: 310000, savings: 2720000, loans: 1650000 },
    { month: 'Mar', income: 450000, expenses: 320000, savings: 2850000, loans: 1750000 }
  ];

  const loanStatusData = [
    { status: 'Active', count: 89, amount: 1200000 },
    { status: 'Pending', count: 12, amount: 250000 },
    { status: 'Completed', count: 156, amount: 3500000 },
    { status: 'Overdue', count: 8, amount: 120000 }
  ];

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
                <h1 className="text-xl font-bold text-gray-900">Financial Reports</h1>
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
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.role === 'member' ? 'My Statements' : 'Financial Reports'}
            </h2>
            <p className="text-gray-600">
              {user?.role === 'member' ? 'View your account statements and transaction history' : 'Comprehensive cooperative financial analytics'}
            </p>
          </div>
          {user?.role !== 'member' && (
            <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
          )}
        </div>

        {user?.role === 'member' ? (
          // Member Statement View
          <div className="space-y-8">
            {/* Member's Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Share Capital</p>
                      <p className="text-2xl font-bold text-gray-900">₱15,000</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Savings</p>
                      <p className="text-2xl font-bold text-gray-900">₱35,000</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <PiggyBank className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Outstanding Loans</p>
                      <p className="text-2xl font-bold text-gray-900">₱0</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Available Credit</p>
                      <p className="text-2xl font-bold text-gray-900">₱75,000</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Member Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2025-01-15', type: 'Savings Deposit', amount: 5000, balance: 35000 },
                    { date: '2025-01-10', type: 'Share Capital', amount: 5000, balance: 15000 },
                    { date: '2024-12-15', type: 'Savings Deposit', amount: 10000, balance: 30000 },
                    { date: '2024-11-15', type: 'Savings Deposit', amount: 15000, balance: 20000 }
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.type}</p>
                          <p className="text-xs text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">+₱{transaction.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Balance: ₱{transaction.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Member Benefits Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    My Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Dividend Earnings</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">2024 Dividend</span>
                          <span className="font-medium">₱1,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Interest Earned</span>
                          <span className="font-medium">₱1,225</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Loan Benefits</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Available Loan Amount</span>
                          <span className="font-medium">₱75,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Interest Rate</span>
                          <span className="font-medium">10-15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Account Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { month: 'Jan 2025', savings: 35000, shareCapital: 15000 },
                      { month: 'Dec 2024', savings: 30000, shareCapital: 10000 },
                      { month: 'Nov 2024', savings: 20000, shareCapital: 10000 }
                    ].map((data, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{data.month}</span>
                          <span className="text-sm text-gray-600">
                            Total: ₱{(data.savings + data.shareCapital).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">Savings</span>
                            <span className="font-medium">₱{data.savings.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-600">Share Capital</span>
                            <span className="font-medium">₱{data.shareCapital.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Admin/Staff Financial Reports View
          <>
            {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{financialData.totalMembers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+{financialData.activeMembers - financialData.totalMembers + 67} this month</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Savings</p>
                  <p className="text-2xl font-bold text-gray-900">₱{(financialData.totalSavings / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-600 mt-1">+8.5% from last month</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <PiggyBank className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Loans</p>
                  <p className="text-2xl font-bold text-gray-900">₱{(financialData.totalLoans / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-blue-600 mt-1">+12.3% from last month</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Income</p>
                  <p className="text-2xl font-bold text-gray-900">₱{(financialData.netIncome / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-green-600 mt-1">+15.2% from last month</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Monthly Income vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{data.month} 2024</span>
                      <span className="text-sm text-gray-600">
                        Net: ₱{((data.income - data.expenses) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Income</span>
                        <span className="text-sm font-medium text-green-600">₱{(data.income / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(data.income / 500000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-red-600">Expenses</span>
                        <span className="text-sm font-medium text-red-600">₱{(data.expenses / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${(data.expenses / 500000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Loan Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'Active' ? 'bg-green-500' :
                        item.status === 'Pending' ? 'bg-yellow-500' :
                        item.status === 'Completed' ? 'bg-blue-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{item.status}</p>
                        <p className="text-sm text-gray-600">{item.count} loans</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₱{(item.amount / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-gray-600">
                        {((item.count / loanStatusData.reduce((sum, l) => sum + l.count, 0)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Financial Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Assets</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Savings</span>
                      <span className="font-medium">₱{financialData.totalSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loans Outstanding</span>
                      <span className="font-medium">₱{financialData.totalLoans.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Share Capital</span>
                      <span className="font-medium">₱{financialData.shareCapital.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Assets</span>
                        <span>₱{(financialData.totalSavings + financialData.totalLoans + financialData.shareCapital).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Liabilities</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Deposits</span>
                      <span className="font-medium">₱{financialData.totalSavings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Share Capital</span>
                      <span className="font-medium">₱{financialData.shareCapital.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Liabilities</span>
                        <span>₱{(financialData.totalSavings + financialData.shareCapital).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Monthly Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Revenue Highlights</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Loan Interest</span>
                      <span className="font-medium">₱350,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Service Fees</span>
                      <span className="font-medium">₱75,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Other Income</span>
                      <span className="font-medium">₱25,000</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Expense Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-700">Operational Expenses</span>
                      <span className="font-medium">₱180,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Staff Salaries</span>
                      <span className="font-medium">₱120,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Other Expenses</span>
                      <span className="font-medium">₱20,000</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Key Metrics</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Return on Assets</span>
                      <span className="font-medium">8.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Loan to Deposit Ratio</span>
                      <span className="font-medium">61.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Operating Margin</span>
                      <span className="font-medium">28.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          </>
        )}
      </div>
    </div>
  );
}