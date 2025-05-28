import React from 'react';
import AuthLayout from '@components/auth/AuthLayout';
import PublicRegisterForm from '@components/auth/PublicRegisterForm';

// Disable static generation since this page uses auth context
export const dynamic = 'force-dynamic';

const PublicRegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Join FreelanceMarket"
      subtitle="Create your account and start your journey now"
      showBackButton={true}
    >
      <PublicRegisterForm />
    </AuthLayout>
  );
};

export default PublicRegisterPage;
