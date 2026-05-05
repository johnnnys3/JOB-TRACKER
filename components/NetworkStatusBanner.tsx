'use client';

import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function NetworkStatusBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      You are offline. Existing data may still be available.
    </div>
  );
}
