'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
  requiredRole?: 'ADMIN' | 'CLIENT' | 'FREELANCER';
  redirectTo?: string;
}

/**
 * Authentication guard component that protects routes
 * Only renders children when authentication requirements are met
 */
export function AuthGuard({
  children,
  requireAuth = true,
  adminOnly = false,
  requiredRole,
  redirectTo = '/auth/login'
}: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || loading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (adminOnly && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard');
      return;
    }
  }, [isClient, loading, isAuthenticated, user, requireAuth, adminOnly, requiredRole, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Don't render anything if admin access is required but user is not admin
  if (adminOnly && user?.role !== 'ADMIN') {
    return null;
  }

  // Don't render anything if specific role is required but user doesn't have it
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
