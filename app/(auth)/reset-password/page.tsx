'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';
import { ApiError } from '@/services/api';
import { AuthShell } from '@/components/AuthShell';
import { AlertMessage } from '@/components/AlertMessage';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!token) {
      setError('Password reset link is missing a token.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await authService.resetPassword(token, password);
      setIsSuccess(true);
      setTimeout(() => router.push('/login'), 1500);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.statusCode === 400) {
        setError('Password reset link is invalid or has expired');
      } else {
        setError('Unable to reset your password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Choose a new password" description="Create a secure password for your account.">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                New password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
                placeholder="Enter your new password"
                disabled={isLoading || isSuccess}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm new password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2"
                placeholder="Confirm your new password"
                disabled={isLoading || isSuccess}
                minLength={6}
              />
            </div>
          </div>

          {isSuccess && (
            <AlertMessage variant="success">Password reset successfully. Redirecting to sign in...</AlertMessage>
          )}

          {error && (
            <AlertMessage variant="error">{error}</AlertMessage>
          )}

          <Button type="submit" className="w-full" disabled={isSuccess} loading={isLoading}>
            Reset password
          </Button>

          <div className="text-center">
            <Link href="/login" className="text-sm font-semibold text-primary hover:underline">
              Back to sign in
            </Link>
          </div>
        </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
