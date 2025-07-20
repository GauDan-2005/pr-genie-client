import { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period?: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

const EnhancedStatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  badge,
  color = 'default',
  size = 'md',
  className = "",
  onClick,
  loading = false
}: StatsCardProps) => {
  const colorClasses = {
    default: 'bg-card border-border',
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
  };

  const iconColors = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400'
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const titleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const valueSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatValue = (val: string | number) => {
    if (loading) return '---';
    if (typeof val === 'number') {
      // Format large numbers
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toString();
    }
    return val;
  };

  return (
    <div
      className={`
        ${colorClasses[color]} 
        ${sizeClasses[size]} 
        border rounded-lg transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''}
        ${loading ? 'animate-pulse' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className={`${iconSizes[size]} ${iconColors[color]}`} />
          )}
          <span className={`${titleSizes[size]} font-medium text-muted-foreground`}>
            {title}
          </span>
        </div>
        {badge && (
          <Badge variant={badge.variant || 'secondary'} className="text-xs">
            {badge.text}
          </Badge>
        )}
      </div>

      {/* Value */}
      <div className={`${valueSizes[size]} font-bold text-foreground mb-1`}>
        {formatValue(value)}
      </div>

      {/* Description and Trend */}
      <div className="flex items-center justify-between">
        {description && (
          <span className="text-xs text-muted-foreground">
            {description}
          </span>
        )}
        
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span>{Math.abs(trend.value)}%</span>
            {trend.period && (
              <span className="text-muted-foreground">
                {trend.period}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedStatsCard;