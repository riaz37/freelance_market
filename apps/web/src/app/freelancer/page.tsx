'use client';

import React, { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import LoginForm from '@components/LoginForm';
import Layout from '@components/Layout';
import ProjectsManagement from '@components/ProjectsManagement';
import OrdersManagement from '@components/OrdersManagement';
import NotificationsManagement from '@components/NotificationsManagement';
import { AuthGuard } from '@components/AuthGuard';

// Disable static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

const FreelancerContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('projects');

  const renderPage = () => {
    switch (currentPage) {
      case 'projects':
        return <ProjectsManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'notifications':
        return <NotificationsManagement />;
      default:
        return <ProjectsManagement />;
    }
  };

  return (
    <FreelancerLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </FreelancerLayout>
  );
};

// Custom layout for freelancer with different navigation
const FreelancerLayout: React.FC<{
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const freelancerNavigation = [
    { name: 'My Projects', href: 'projects', icon: 'briefcase' },
    { name: 'Orders', href: 'orders', icon: 'clipboard' },
    { name: 'Notifications', href: 'notifications', icon: 'bell' },
  ];

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-slate-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="ml-3 text-lg font-semibold text-slate-900">Freelancer Hub</span>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-1">
                {freelancerNavigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onPageChange(item.href)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left ${
                      currentPage === item.href
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="mr-3">
                      {item.icon === 'briefcase' && '💼'}
                      {item.icon === 'clipboard' && '📋'}
                      {item.icon === 'bell' && '🔔'}
                    </span>
                    {item.name}
                  </button>
                ))}
              </nav>
              <div className="flex-shrink-0 px-4 pb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 text-sm font-medium">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="mt-3 w-full flex items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <span className="mr-3">🚪</span>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center h-16 px-4 border-b border-slate-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span>☰</span>
          </button>
          <div className="ml-4 flex items-center">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-slate-900">Freelancer Hub</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="ml-3 text-lg font-semibold text-slate-900">Freelancer</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span>✕</span>
              </button>
            </div>
            <nav className="mt-8 px-4 space-y-1">
              {freelancerNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onPageChange(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full text-left ${
                    currentPage === item.href
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="mr-3">
                    {item.icon === 'briefcase' && '💼'}
                    {item.icon === 'clipboard' && '📋'}
                    {item.icon === 'bell' && '🔔'}
                  </span>
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

const FreelancerPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthGuard requiredRole="FREELANCER">
      <FreelancerContent />
    </AuthGuard>
  );
};

export default FreelancerPage;
