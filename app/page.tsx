'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Building2, TrendingUp, Shield } from 'lucide-react';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('cooperative-user');
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Demo credentials
    const demoUsers = [
      { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
      { username: 'staff', password: 'staff123', role: 'staff', name: 'Staff User' },
      { username: 'member', password: 'member123', role: 'member', name: 'Member User' }
    ];

    const user = demoUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      localStorage.setItem('cooperative-user', JSON.stringify(user));
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Try admin/admin123, staff/staff123, or member/member123');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Philippine Cooperative</h1>
                <p className="text-sm text-gray-600">Management System</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <div className="w-full max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Features */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to Your Cooperative
                </h2>
                <p className="text-gray-600 text-lg">
                  Complete management solution for Philippine cooperatives
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Member Management</h3>
                    <p className="text-gray-600 text-sm">Complete member profiles and registration</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Loan & Savings</h3>
                    <p className="text-gray-600 text-sm">Track loans, savings, and share capital</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Financial Reports</h3>
                    <p className="text-gray-600 text-sm">Comprehensive financial analytics</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <p className="text-gray-600">Access your cooperative account</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      required
                    />
                  </div>
                  {error && (
                    <Alert>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Admin:</strong> admin / admin123</p>
                    <p><strong>Staff:</strong> staff / staff123</p>
                    <p><strong>Member:</strong> member / member123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}