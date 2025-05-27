'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '@contexts/AuthContext';
import client from '@lib/apollo-client';

interface ClientProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper
 * This component wraps all client-side providers (Apollo, Auth, etc.)
 * and ensures they're only rendered on the client side
 */
export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ApolloProvider>
  );
}
