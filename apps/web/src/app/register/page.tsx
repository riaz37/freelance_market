import React from 'react';
import AuthLayout from '../../../components/auth/AuthLayout';
import PublicRegisterForm from '../../../components/auth/PublicRegisterForm';

const PublicRegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Join FreelanceMarket"
      subtitle="Create your account and start your journey"
      showBackButton={true}
    >
      <PublicRegisterForm />
    </AuthLayout>
  );
};

export default PublicRegisterPage;
