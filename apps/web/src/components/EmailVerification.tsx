'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { VERIFY_EMAIL_MUTATION, RESEND_VERIFICATION_MUTATION } from '@graphql';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { emailVerificationSchema, validateFormData } from '@validation';

interface EmailVerificationProps {
  email: string;
  onVerificationSuccess?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onVerificationSuccess }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [verifyEmail, { loading: verifyLoading }] = useMutation(VERIFY_EMAIL_MUTATION);
  const [resendCode, { loading: resendLoading }] = useMutation(RESEND_VERIFICATION_MUTATION);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate using Zod schema
    const result = validateFormData(emailVerificationSchema, { verificationCode });

    if (!result.success) {
      const errorMessage = Object.values(result.errors)[0] || 'Please enter a valid verification code';
      setError(errorMessage);
      return;
    }

    try {
      const { data } = await verifyEmail({
        variables: {
          verifyEmailInput: {
            email,
            verificationCode,
          },
        },
      });

      setMessage(data.verifyEmail.message);
      setIsVerified(true);

      if (onVerificationSuccess) {
        onVerificationSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    }
  };

  const handleResendCode = async () => {
    setError('');
    setMessage('');

    try {
      const { data } = await resendCode({
        variables: {
          resendVerificationInput: {
            email,
          },
        },
      });

      setMessage(data.resendVerificationCode.message);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">
              You can now access all features of FreelanceMarket.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <EnvelopeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={verifyLoading || verificationCode.length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {verifyLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              The verification code expires in 15 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
