'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { X } from 'lucide-react';

type ToastTone = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  const notify = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = crypto.randomUUID();
    setToasts(current => [...current, { id, message, tone }].slice(-4));
    window.setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            role="status"
            className={toastClassName(toast.tone)}
          >
            <span className="text-sm font-semibold">{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="rounded-full p-1 text-current opacity-70 transition hover:opacity-100 focus-ring"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function toastClassName(tone: ToastTone) {
  const base = 'flex items-center justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg';

  if (tone === 'success') {
    return `${base} border-emerald-200 bg-emerald-50 text-emerald-900`;
  }

  if (tone === 'error') {
    return `${base} border-red-200 bg-red-50 text-red-900`;
  }

  return `${base} border-slate-200 bg-white text-slate-900`;
}
