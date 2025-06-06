import React from 'react';
import AuthLayout from '@components/auth/AuthLayout';
import PublicLoginForm from '@components/auth/PublicLoginForm';

// Disable static generation since this page uses auth context
export const dynamic = 'force-dynamic';

const PublicLoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your FreelanceMarket account"
      showBackButton={true}
    >
      <PublicLoginForm />
    </AuthLayout>
  );
};

export default PublicLoginPage;
