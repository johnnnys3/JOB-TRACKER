import { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  WISHLIST: {
    label: 'Saved',
    className: 'bg-slate-100 text-slate-700 border-slate-200 before:bg-slate-500'
  },
  APPLIED: {
    label: 'Applied',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 before:bg-emerald-500'
  },
  INTERVIEW: {
    label: 'Interview',
    className: 'bg-violet-50 text-violet-700 border-violet-200 before:bg-violet-500'
  },
  OFFER: {
    label: 'Offer',
    className: 'bg-green-50 text-green-700 border-green-200 before:bg-green-500'
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 border-red-200 before:bg-red-500'
  },
  ACCEPTED: {
    label: 'Closed',
    className: 'bg-teal-50 text-teal-700 border-teal-200 before:bg-teal-500'
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold before:h-1.5 before:w-1.5 before:rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}
