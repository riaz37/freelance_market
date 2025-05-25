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
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  changeType?: 'increase' | 'decrease';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'increase',
  description = 'from last month'
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
        <Icon className="h-6 w-6 text-slate-600" />
      </div>
    </div>
    {change && (
      <div className="flex items-center mt-4">
        <div className={`flex items-center text-sm ${
          changeType === 'increase' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'increase' ? (
            <ArrowUpIcon className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 mr-1" />
          )}
          <span className="font-medium">{change}</span>
        </div>
        <span className="text-sm text-slate-500 ml-2">{description}</span>
      </div>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_DASHBOARD_STATS);
  const { data: healthData, loading: healthLoading } = useQuery(HEALTH_CHECK);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-red-500 rounded-full mr-3"></div>
          <div>
            <h3 className="text-sm font-medium text-red-900">Error loading dashboard</h3>
            <p className="text-sm text-red-700 mt-1">{statsError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = statsData?.adminDashboardStats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            healthLoading ? 'bg-yellow-500' : 'bg-green-500'
          }`}></div>
          <span className="text-sm font-medium text-slate-900">System Status:</span>
          <span className={`ml-2 text-sm font-medium ${
            healthLoading ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {healthLoading ? 'Checking...' : healthData?.healthCheck || 'Online'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          icon={UsersIcon}
          change="+12%"
          changeType="increase"
        />
        <StatCard
          title="Active Projects"
          value={stats?.activeProjects?.toLocaleString() || '0'}
          icon={BriefcaseIcon}
          change="+8%"
          changeType="increase"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toLocaleString() || '0'}
          icon={ClipboardDocumentListIcon}
          change="+23%"
          changeType="increase"
        />
        <StatCard
          title="Active Orders"
          value={stats?.activeOrders?.toLocaleString() || '0'}
          icon={ClockIcon}
          change="+5%"
          changeType="increase"
        />
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects?.toLocaleString() || '0'}
          icon={BriefcaseIcon}
          change="+15%"
          changeType="increase"
        />
        <StatCard
          title="Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          icon={CurrencyDollarIcon}
          change="+18%"
          changeType="increase"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="group p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <UsersIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Manage Users</h3>
            <p className="text-sm text-slate-600">View and manage all platform users</p>
          </button>

          <button className="group p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-left">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <BriefcaseIcon className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">View Projects</h3>
            <p className="text-sm text-slate-600">Monitor active and completed projects</p>
          </button>

          <button className="group p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <ClipboardDocumentListIcon className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Manage Orders</h3>
            <p className="text-sm text-slate-600">Track and process customer orders</p>
          </button>

          <button className="group p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-left">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <CheckCircleIcon className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">System Settings</h3>
            <p className="text-sm text-slate-600">Configure platform settings</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">New user registered</p>
              <p className="text-xs text-slate-600">john.doe@example.com joined the platform</p>
            </div>
            <span className="text-xs text-slate-500">2 min ago</span>
          </div>

          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Project completed</p>
              <p className="text-xs text-slate-600">Website redesign project was marked as complete</p>
            </div>
            <span className="text-xs text-slate-500">1 hour ago</span>
          </div>

          <div className="flex items-center p-4 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">New order received</p>
              <p className="text-xs text-slate-600">Mobile app development order for $2,500</p>
            </div>
            <span className="text-xs text-slate-500">3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
