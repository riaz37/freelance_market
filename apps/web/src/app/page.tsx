'use client';

import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import client from '../../lib/apollo-client';
import LoginForm from '../../components/LoginForm';
import Layout from '../../components/Layout';
import Dashboard from '../../components/Dashboard';
import UsersManagement from '../../components/UsersManagement';

const AdminApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

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

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    </ApolloProvider>
  );
}
