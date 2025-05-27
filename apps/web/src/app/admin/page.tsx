'use client';

import React, { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import LoginForm from '@components/LoginForm';
import Layout from '@components/Layout';
import Dashboard from '@components/Dashboard';
import UsersManagement from '@components/UsersManagement';
import { AuthGuard } from '@components/AuthGuard';

// Disable static generation for this page since it requires authentication
export const dynamic = 'force-dynamic';

const AdminContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UsersManagement />;
      case 'projects':
        return <div className="text-center py-12">Projects management coming soon...</div>;
      case 'orders':
        return <div className="text-center py-12">Orders management coming soon...</div>;
      case 'settings':
        return <div className="text-center py-12">Settings coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const AdminPage: React.FC = () => {
  return (
    <AuthGuard requireAuth={true} adminOnly={true}>
      <AdminContent />
    </AuthGuard>
  );
};

export default AdminPage;
