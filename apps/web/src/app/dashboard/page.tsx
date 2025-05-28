'use client';

import React from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@components/AuthGuard';

// Disable static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

const DashboardContent: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Since this is wrapped in AuthGuard, user will never be null
  if (!user) return null;

  // Redirect to role-specific dashboard
  React.useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'ADMIN':
          router.push('/admin');
          break;
        case 'CLIENT':
          router.push('/client');
          break;
        case 'FREELANCER':
          router.push('/freelancer');
          break;
        default:
          // Stay on current page if role is unknown
          break;
      }
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">FreelanceMarket</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your {user.role.toLowerCase()} account.
          </p>
        </div>

        {/* Email Verification Banner */}
        {!user.isVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Email verification required
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Please verify your email address to access all features.
                </p>
              </div>
              <div className="ml-auto">
                <Link
                  href="/auth/verify-email"
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                >
                  Verify Email
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Role-specific Dashboard Content */}
        {user.role === 'FREELANCER' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Bio:</span> {user.bio || 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Skills:</span> {user.skills?.join(', ') || 'Not set'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Hourly Rate:</span> ${user.hourlyRate || 'Not set'}
                </p>
              </div>
              <button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                Edit Profile →
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h3>
              <div className="text-center py-8">
                <span className="text-3xl">📋</span>
                <p className="text-gray-600 mt-2">No active projects</p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Browse Projects →
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings</h3>
              <div className="text-center py-8">
                <span className="text-3xl">💰</span>
                <p className="text-gray-600 mt-2">$0.00 earned</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'CLIENT' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Posted Projects</h3>
              <div className="text-center py-8">
                <span className="text-3xl">📝</span>
                <p className="text-gray-600 mt-2">No projects posted</p>
                <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Post a Project →
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Orders</h3>
              <div className="text-center py-8">
                <span className="text-3xl">🔄</span>
                <p className="text-gray-600 mt-2">No active orders</p>
                <p className="text-xs text-gray-500">Orders will appear here</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Spent</h3>
              <div className="text-center py-8">
                <span className="text-3xl">💳</span>
                <p className="text-gray-600 mt-2">$0.00 spent</p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'ADMIN' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h3>
              <p className="text-gray-600 mb-4">Access the full admin dashboard</p>
              <Link
                href="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-block"
              >
                Go to Admin Panel →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server</span>
                  <span className="text-green-600 text-sm">●</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-green-600 text-sm">●</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <span className="text-yellow-600 text-sm">●</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Users:</span> Loading...
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Active Projects:</span> Loading...
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Orders:</span> Loading...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
              <span className="text-2xl mb-2 block">📧</span>
              <h3 className="font-medium text-gray-900">Messages</h3>
              <p className="text-sm text-gray-600">View conversations</p>
            </button>

            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
              <span className="text-2xl mb-2 block">🔔</span>
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">Check updates</p>
            </button>

            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
              <span className="text-2xl mb-2 block">⚙️</span>
              <h3 className="font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600">Account preferences</p>
            </button>

            <button className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-left">
              <span className="text-2xl mb-2 block">❓</span>
              <h3 className="font-medium text-gray-900">Help</h3>
              <p className="text-sm text-gray-600">Get support</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContent />
    </AuthGuard>
  );
};

export default DashboardPage;
