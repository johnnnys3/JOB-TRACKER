'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { ApiError } from '@/services/api';
import { AuthShell } from '@/components/AuthShell';
import { AlertMessage } from '@/components/AlertMessage';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate firstName
    if (!firstName.trim()) {
      setError('First name is required');
      setIsLoading(false);
      return;
    }

    // Validate lastName
    if (!lastName.trim()) {
      setError('Last name is required');
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await register(email, password, firstName, lastName);
      setIsSuccess(true);
      setError('');
    } catch (err: unknown) {
      if (err instanceof ApiError && err.statusCode === 409) {
        setError('An account with this email already exists');
      } else if (err instanceof ApiError && err.statusCode === 400) {
        setError('Invalid email or password format');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title={isSuccess ? 'Account created' : 'Create your workspace'}
      description={isSuccess ? (
        <>
          Your account is ready.{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in to continue
          </Link>
        </>
      ) : 'Start organizing your job search in minutes.'}
      variant="register"
    >
        
        {!isSuccess && (
          <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="mt-2"
                  placeholder="First name"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="mt-2"
                  placeholder="Last name"
                  disabled={isLoading}
                />
              </div>
            </div>
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
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
                placeholder="Enter your password (min 6 characters)"
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2"
                placeholder="Confirm your password"
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <AlertMessage variant="error">{error}</AlertMessage>
          )}

          <Button type="submit" className="w-full" loading={isLoading}>
            Create account
          </Button>

          <div className="text-center text-xs leading-5 text-muted-foreground">
            By creating an account, you agree to our terms of service and privacy policy.
          </div>
        </form>
        )}
    </AuthShell>
  );
}
