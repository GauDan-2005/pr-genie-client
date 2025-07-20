import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X, Loader2 } from "lucide-react";

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  loading?: boolean;
  showSearchButton?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SearchBox = ({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  onClear,
  debounceMs = 300,
  loading = false,
  showSearchButton = false,
  className = "",
  size = 'md'
}: SearchBoxProps) => {
  const [internalValue, setInternalValue] = useState(value);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange && internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChange, value]);

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(internalValue);
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  const handleClear = () => {
    setInternalValue("");
    if (onChange) onChange("");
    if (onClear) onClear();
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(internalValue);
    }
  };

  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-sm",
    lg: "h-12 text-base"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        {loading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Search className={iconSizes[size]} />
        )}
      </div>

      {/* Input Field */}
      <Input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={`pl-10 ${showSearchButton ? 'pr-20' : internalValue ? 'pr-10' : 'pr-4'} ${sizeClasses[size]}`}
        disabled={loading}
      />

      {/* Clear Button */}
      {internalValue && !showSearchButton && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className={iconSizes[size]} />
        </button>
      )}

      {/* Search Button */}
      {showSearchButton && (
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {internalValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className={iconSizes[size]} />
            </button>
          )}
          <Button
            type="button"
            size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'sm'}
            onClick={handleSearchClick}
            disabled={loading || !internalValue.trim()}
            className="h-8 px-3"
          >
            {loading ? (
              <Loader2 className={`${iconSizes[size]} animate-spin`} />
            ) : (
              <Search className={iconSizes[size]} />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchBox;