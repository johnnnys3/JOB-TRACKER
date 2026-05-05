'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';
import { AuthShell } from '@/components/AuthShell';
import { AlertMessage } from '@/components/AlertMessage';

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
    <AuthShell title="Reset your password" description="Enter your email and we'll send reset instructions.">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          {message && (
            <AlertMessage variant="success">{message}</AlertMessage>
          )}

          {resetUrl && (
            <div className="break-words rounded-2xl border border-teal-200 bg-teal-50 p-3 text-sm">
              <div className="mb-1 font-semibold text-foreground">Development reset link</div>
              <Link href={resetUrl} className="font-medium text-primary hover:underline">
                {resetUrl}
              </Link>
            </div>
          )}

          {error && (
            <AlertMessage variant="error">{error}</AlertMessage>
          )}

          <Button type="submit" className="w-full" loading={isLoading}>
            Send reset link
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
