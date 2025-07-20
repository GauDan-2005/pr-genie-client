const StatsCard = ({ 
  title, 
  value, 
  loading = false 
}: { 
  title: string; 
  value: number; 
  loading?: boolean; 
}) => {
  return (
    <div className="flex flex-col items-center justify-start gap-4 flex-1 p-6 bg-foreground/5 rounded-[20px] text-foreground/90 text-center">
      {loading ? (
        <div className="h-10 w-16 bg-foreground/10 rounded-md animate-pulse"></div>
      ) : (
        <h1 className="text-4xl font-bold">{value}</h1>
      )}
      <p className="text-base font-medium overflow-ellipsis">{title}</p>
    </div>
  );
};
export default StatsCard;
