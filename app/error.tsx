'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">The workspace could not load.</h1>
        <p className="mt-3 text-muted-foreground">
          Try again, or sign back in if the session has expired.
        </p>
        <Button className="mt-6" onClick={reset}>Try Again</Button>
      </section>
    </main>
  );
}
