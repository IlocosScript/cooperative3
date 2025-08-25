'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Plus,
  Eye,
  DollarSign,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface User {
  username: string;
  role: string;
  name: string;
}

export default function Dashboard() {
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



  if (!user) return <div>Loading...</div>;

  const dashboardData = {
    totalMembers: 1247,
    activeLoans: 89,
    totalSavings: 2850000,
    pendingApplications: 12,
    monthlyCollection: 450000,
    shareCapital: 1200000
  };

  // Role-based dashboard data
  const getRoleBasedData = () => {
    if (user.role === 'member') {
      return {
        myShareCapital: 15000,
        mySavings: 35000,
        myLoans: 50000,
        myLastPayment: '2025-01-10',
        availableLoanAmount: 75000,
        memberSince: '2024-02-10'
      };
    }
    return dashboardData;
  };

  const memberData = getRoleBasedData();

  const recentActivities = [
    { type: 'loan', member: 'Juan Dela Cruz', amount: 50000, date: '2025-01-15', status: 'approved' },
    { type: 'savings', member: 'Maria Santos', amount: 15000, date: '2025-01-14', status: 'deposited' },
    { type: 'member', member: 'Pedro Reyes', amount: 0, date: '2025-01-13', status: 'registered' },
    { type: 'loan', member: 'Ana Garcia', amount: 75000, date: '2025-01-12', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          {user.role === 'member' ? (
            <p className="text-gray-600">
              Here's your account overview and available services.
            </p>
          ) : (
            <p className="text-gray-600">
              Here's what's happening with your cooperative today.
            </p>
          )}
        </div>

        {/* Stats Cards - Role Based */}
        {user.role === 'member' ? (
          // Member Dashboard
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Share Capital</p>
                    <p className="text-3xl font-bold text-gray-900">₱15,000</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">My Savings</p>
                    <p className="text-3xl font-bold text-gray-900">₱35,000</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <PiggyBank className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Outstanding Loans</p>
                    <p className="text-3xl font-bold text-gray-900">₱0</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Credit</p>
                    <p className="text-3xl font-bold text-gray-900">₱75,000</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                    <p className="text-2xl font-bold text-gray-900">2024</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Membership Status</p>
                    <p className="text-2xl font-bold text-green-600">Active</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Admin/Staff Dashboard
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.totalMembers.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Loans</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.activeLoans}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Savings</p>
                  <p className="text-3xl font-bold text-gray-900">₱{(dashboardData.totalSavings / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <PiggyBank className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Collection</p>
                  <p className="text-3xl font-bold text-gray-900">₱{(dashboardData.monthlyCollection / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Share Capital</p>
                  <p className="text-3xl font-bold text-gray-900">₱{(dashboardData.shareCapital / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-teal-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingApplications}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Quick Actions & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {user.role === 'member' ? 'My Services' : 'Quick Actions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.role === 'member' ? (
                <>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => router.push('/loans')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Apply for Loan
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => router.push('/savings')}
                  >
                    <PiggyBank className="w-4 h-4 mr-2" />
                    My Savings
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => router.push('/members')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    My Profile
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => router.push('/reports')}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    My Statements
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => router.push('/members')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Members
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/loans')}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Process Loans
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/savings')}
              >
                <PiggyBank className="w-4 h-4 mr-2" />
                Savings Management
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => router.push('/reports')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                {user.role === 'member' ? 'My Recent Activities' : 'Recent Activities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(user.role === 'member' ? 
                  recentActivities.filter(a => a.member === 'Maria Santos') : // Only show member's own activities
                  recentActivities
                ).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'loan' ? 'bg-green-100' :
                        activity.type === 'savings' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'loan' ? <CreditCard className="w-4 h-4 text-green-600" /> :
                         activity.type === 'savings' ? <PiggyBank className="w-4 h-4 text-blue-600" /> :
                         <Users className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {user.role === 'member' ? 'You' : activity.member}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.type === 'loan' ? 'Loan Application' :
                           activity.type === 'savings' ? 'Savings Deposit' : 'Member Registration'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {activity.amount > 0 && (
                        <p className="text-sm font-medium">₱{activity.amount.toLocaleString()}</p>
                      )}
                      <Badge variant={
                        activity.status === 'approved' ? 'default' :
                        activity.status === 'pending' ? 'secondary' : 'outline'
                      } className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}