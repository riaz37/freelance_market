'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS, HEALTH_CHECK } from '../lib/graphql/queries';
import {
  UsersIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
      {change && (
        <div className="mt-3">
          <span className="text-sm text-green-600">{change}</span>
        </div>
      )}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_DASHBOARD_STATS);
  const { data: healthData, loading: healthLoading } = useQuery(HEALTH_CHECK);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{statsError.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = statsData?.adminDashboardStats;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome to the Freelance Market Admin Panel
        </p>
      </div>

      {/* System Health */}
      <div className="mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-900">System Status:</span>
            <span className={`ml-2 text-sm ${healthLoading ? 'text-yellow-600' : 'text-green-600'}`}>
              {healthLoading ? 'Checking...' : healthData?.healthCheck || 'Online'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={UsersIcon}
          color="text-blue-500"
        />
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects || 0}
          icon={BriefcaseIcon}
          color="text-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ClipboardDocumentListIcon}
          color="text-purple-500"
        />
        <StatCard
          title="Active Projects"
          value={stats?.activeProjects || 0}
          icon={ClockIcon}
          color="text-yellow-500"
        />
        <StatCard
          title="Active Orders"
          value={stats?.activeOrders || 0}
          icon={ClockIcon}
          color="text-orange-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={CurrencyDollarIcon}
          color="text-green-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-left transition-colors cursor-pointer">
                <div className="text-sm font-medium text-indigo-900">View All Users</div>
                <div className="text-xs text-indigo-600 mt-1">Manage user accounts</div>
              </div>
              <div className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-left transition-colors cursor-pointer">
                <div className="text-sm font-medium text-green-900">Active Projects</div>
                <div className="text-xs text-green-600 mt-1">Monitor ongoing work</div>
              </div>
              <div className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-left transition-colors cursor-pointer">
                <div className="text-sm font-medium text-purple-900">Recent Orders</div>
                <div className="text-xs text-purple-600 mt-1">Track order status</div>
              </div>
              <div className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg text-left transition-colors cursor-pointer">
                <div className="text-sm font-medium text-yellow-900">System Settings</div>
                <div className="text-xs text-yellow-600 mt-1">Configure platform</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
