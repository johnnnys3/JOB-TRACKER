import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900'
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900'
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-900'
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-900'
  }
};

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const config = colorConfig[color];
  
  return (
    <div className={`${config.bg} rounded-lg p-6 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${config.textColor}`}>{title}</p>
          <p className={`text-2xl font-bold ${config.textColor} mt-1`}>{value}</p>
        </div>
        <div className={`${config.iconBg} rounded-lg p-3`}>
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>
      </div>
    </div>
  );
}
