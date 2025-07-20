interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({ 
  className = "", 
  variant = 'default',
  width,
  height
}: SkeletonProps) => {
  const baseClasses = "animate-pulse bg-muted";
  
  const variantClasses = {
    default: "rounded",
    circular: "rounded-full",
    rounded: "rounded-lg"
  };

  const style: React.CSSProperties = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height })
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Repository Card Skeleton
export const RepoCardSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-4 space-y-3">
    <div className="flex items-start justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton variant="circular" className="h-6 w-6" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  </div>
);

// Comment Card Skeleton
export const CommentCardSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-8 h-8" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
      <Skeleton className="h-3 w-20" />
    </div>
    
    <Skeleton className="h-5 w-3/4" />
    
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    
    <div className="flex items-center justify-between pt-3">
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-8" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

// Pull Request Skeleton
export const PullRequestSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
    <div className="flex items-start gap-4">
      <Skeleton variant="circular" className="w-5 h-5 mt-1" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-card border border-border rounded-lg p-4 space-y-3">
    <div className="flex items-center gap-2">
      <Skeleton variant="circular" className="h-5 w-5" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-8 w-12" />
    <Skeleton className="h-3 w-20" />
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => (
  <tr className="border-b border-border">
    {Array.from({ length: columns }, (_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// List Item Skeleton
export const ListItemSkeleton = () => (
  <div className="flex items-center gap-3 p-3 border-b border-border">
    <Skeleton variant="circular" className="w-10 h-10" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

// Grid Skeleton
export const GridSkeleton = ({ 
  items = 6, 
  SkeletonComponent = RepoCardSkeleton,
  columns = 'auto-fit'
}: { 
  items?: number;
  SkeletonComponent?: React.ComponentType;
  columns?: string | number;
}) => {
  const gridCols = typeof columns === 'number' 
    ? `repeat(${columns}, minmax(0, 1fr))`
    : `repeat(auto-fit, minmax(300px, 1fr))`;

  return (
    <div 
      className="grid gap-4 w-full"
      style={{ gridTemplateColumns: gridCols }}
    >
      {Array.from({ length: items }, (_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

export default Skeleton;