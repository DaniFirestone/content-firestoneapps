import { type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: string;
  onClick?: () => void;
}

export function MetricCard({ icon: Icon, label, value, trend, color = 'text-primary', onClick }: MetricCardProps) {
  return (
    <Card 
      className={`transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-primary/50' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold">
              {value}
            </p>
            {trend && (
              <p className={`mt-1 text-xs font-medium ${trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.value}
              </p>
            )}
          </div>
          <div className={`${color} rounded-lg bg-muted/50 p-2`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}