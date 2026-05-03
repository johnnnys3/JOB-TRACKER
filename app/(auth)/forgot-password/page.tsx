'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setResetUrl(null);
    setError('');

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      setResetUrl(response.data.resetUrl);
    } catch {
      setError('Unable to create a password reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we will create a reset link.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          {message && (
            <div className="text-green-700 text-sm bg-green-50 p-3 rounded-md">
              {message}
            </div>
          )}

          {resetUrl && (
            <div className="text-sm bg-blue-50 p-3 rounded-md break-words">
              <div className="font-medium text-gray-900 mb-1">Development reset link</div>
              <Link href={resetUrl} className="text-primary hover:text-primary/90">
                {resetUrl}
              </Link>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating link...' : 'Create reset link'}
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/90">
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
