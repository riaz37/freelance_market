'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false 
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">FreelanceMarket</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Connect with talented freelancers and exciting projects. 
              Build your career or find the perfect team member.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="font-semibold">Launch Your Career</h3>
                <p className="text-blue-100">Find projects that match your skills</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h3 className="font-semibold">Hire Top Talent</h3>
                <p className="text-blue-100">Connect with skilled professionals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold">Real-time Collaboration</h3>
                <p className="text-blue-100">Stay connected with live updates</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {showBackButton && (
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          )}
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">{subtitle}</p>
          </div>
          
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
