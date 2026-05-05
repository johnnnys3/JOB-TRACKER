import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'green' | 'red';
  helperText?: string;
  suffix?: string;
}

const colorConfig = {
  blue: {
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-700',
    accent: 'bg-teal-500',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    accent: 'bg-amber-500',
  },
  green: {
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accent: 'bg-emerald-500',
  },
  red: {
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    accent: 'bg-red-500',
  }
};

export function StatCard({ title, value, icon: Icon, color, helperText, suffix = '' }: StatCardProps) {
  const config = colorConfig[color];
  
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/55 bg-white/70 p-5 shadow-[0_18px_48px_rgba(6,95,84,0.08)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/90 hover:shadow-[0_22px_58px_rgba(6,95,84,0.12)]">
      <div className={`absolute inset-x-0 top-0 h-1 ${config.accent}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">{value}{suffix}</p>
          {helperText ? <p className="mt-1 text-xs font-medium text-muted-foreground">{helperText}</p> : null}
        </div>
        <div className={`${config.iconBg} rounded-2xl p-3 shadow-sm`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
