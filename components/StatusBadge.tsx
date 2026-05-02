import { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  WISHLIST: {
    label: 'Wishlist',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  APPLIED: {
    label: 'Applied',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  INTERVIEW: {
    label: 'Interview',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  OFFER: {
    label: 'Offer',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  REJECTED: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  ACCEPTED: {
    label: 'Accepted',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
