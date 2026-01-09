import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({ title, value, icon, description, trend, className }: StatsCardProps) => {
  // Determine if this card should use orange (accent) or blue (primary)
  const isOrange = className?.includes('accent');
  const iconBgColor = isOrange ? 'bg-accent/25' : 'bg-primary/25';
  const iconColor = isOrange ? 'text-accent' : 'text-primary';
  
  return (
    <Card className={cn('glass-card hover-lift overflow-hidden relative group border-0', className)}>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold text-foreground tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-2 pt-1">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  trend.isPositive ? 'bg-green-500' : 'bg-red-500'
                )} />
                <p className={cn(
                  'text-xs font-semibold',
                  trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}% from last month
                </p>
              </div>
            )}
          </div>
          <div className={cn('p-4 rounded-2xl ml-4 group-hover:scale-110 transition-transform duration-300', iconBgColor)}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
