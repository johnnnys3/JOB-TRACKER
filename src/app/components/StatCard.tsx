import { LucideIcon } from "lucide-react";
import { cn } from "./ui/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradient?: string;
}

export function StatCard({ title, value, icon: Icon, trend, gradient = "from-teal-400 to-teal-500" }: StatCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200/50 p-6 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg", gradient)}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-600 mb-2">{title}</p>
        <p className="text-4xl font-bold text-neutral-900 mb-2">{value}</p>
        {trend && (
          <p className={cn(
            "text-sm font-medium flex items-center gap-1",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <span>{trend.isPositive ? "↗" : "↘"}</span>
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}