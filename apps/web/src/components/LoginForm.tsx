'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password, true); // Admin-only for this form
      if (!success) {
        setError('Invalid credentials or insufficient privileges');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-md"></div>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600 text-sm">
            Sign in to your admin account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-700 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-slate-600">
            <p><span className="font-medium">Email:</span> admin@example.com</p>
            <p><span className="font-medium">Password:</span> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
