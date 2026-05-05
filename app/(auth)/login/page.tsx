'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { AuthShell } from '@/components/AuthShell';
import { AlertMessage } from '@/components/AlertMessage';
import { ApiError } from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.statusCode === 401 ? 'Invalid email or password' : err.message);
      } else {
        setError('The API server is not reachable. Start the backend and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Manage your career journey with ease."
      variant="login"
    >
      <form className="auth-stitch-form" onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-foreground/85">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 pl-12"
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-bold text-foreground/85">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pl-12 pr-12"
                placeholder="Password"
                autoComplete="current-password"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary" aria-label="Show password">
                <Eye className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {error ? <AlertMessage variant="error">{error}</AlertMessage> : null}

        <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <input type="checkbox" className="h-4 w-4 rounded border-teal-200 text-primary focus:ring-primary/20" />
          Keep me signed in
        </label>

        <Button type="submit" className="h-12 w-full" loading={isLoading}>
          Sign in
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>

      </form>
    </AuthShell>
  );
}
