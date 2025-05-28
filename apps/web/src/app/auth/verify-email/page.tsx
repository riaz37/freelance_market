'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@components/auth/AuthLayout';
import EmailVerification from '@components/EmailVerification';

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();

  const handleVerificationSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Enter the verification code sent to your email"
      showBackButton={true}
    >
      <EmailVerification
        onVerificationSuccess={handleVerificationSuccess}
      />
    </AuthLayout>
  );
};

export default VerifyEmailPage;
