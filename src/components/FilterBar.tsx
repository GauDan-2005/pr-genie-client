import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, Filter } from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  value: string;
  count?: number;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  displayValue?: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filterKey: string, value: string) => void;
  onFilterRemove: (filterKey: string) => void;
  onClearAll: () => void;
  className?: string;
}

const FilterBar = ({
  filters,
  activeFilters,
  onFilterChange,
  onFilterRemove,
  onClearAll,
  className = ""
}: FilterBarProps) => {
  const groupedFilters = filters.reduce((acc, filter) => {
    if (!acc[filter.key]) {
      acc[filter.key] = [];
    }
    acc[filter.key].push(filter);
    return acc;
  }, {} as Record<string, FilterOption[]>);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(groupedFilters).map(([filterKey, options]) => (
          <div key={filterKey} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground capitalize">
              {filterKey.replace('_', ' ')}
            </label>
            <select
              value={activeFilters.find(f => f.key === filterKey)?.value || ''}
              onChange={(e) => onFilterChange(filterKey, e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring min-w-[120px]"
            >
              <option value="">All {filterKey.replace('_', ' ')}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {option.count !== undefined && `(${option.count})`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Active filters:</span>
          </div>
          
          {activeFilters.map((filter) => (
            <Badge key={`${filter.key}-${filter.value}`} variant="secondary" className="text-xs">
              {filter.label}: {filter.displayValue || filter.value}
              <button
                onClick={() => onFilterRemove(filter.key)}
                className="ml-1 hover:text-foreground"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs h-6"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;