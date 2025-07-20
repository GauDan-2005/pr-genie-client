import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  illustration?: React.ReactNode;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
  size = 'md',
  illustration
}: EmptyStateProps) => {
  const sizeConfig = {
    sm: {
      container: "py-8",
      icon: "h-8 w-8",
      title: "text-base",
      description: "text-sm"
    },
    md: {
      container: "py-12",
      icon: "h-12 w-12",
      title: "text-lg",
      description: "text-sm"
    },
    lg: {
      container: "py-16",
      icon: "h-16 w-16",
      title: "text-xl",
      description: "text-base"
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${config.container} ${className}`}>
      {/* Icon or Illustration */}
      {illustration || (Icon && (
        <Icon className={`${config.icon} text-muted-foreground mb-4`} />
      ))}

      {/* Title */}
      <h3 className={`${config.title} font-medium text-muted-foreground mb-2`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`${config.description} text-muted-foreground max-w-md mb-6`}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size={size === 'sm' ? 'sm' : 'default'}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'outline'}
              size={size === 'sm' ? 'sm' : 'default'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;