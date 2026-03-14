import { ApplicationStatus } from "../types";
import { cn } from "./ui/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  applied: {
    label: "Applied",
    className: "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
  },
  interview: {
    label: "Interview",
    className: "bg-yellow-400 text-neutral-900 shadow-lg shadow-yellow-400/30",
  },
  offer: {
    label: "Offer",
    className: "bg-green-500 text-white shadow-lg shadow-green-500/30",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500 text-white shadow-lg shadow-red-500/30",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-neutral-400 text-white shadow-lg shadow-neutral-400/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}