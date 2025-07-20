import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  hasNextPage: _hasNextPage,
  hasPrevPage: _hasPrevPage,
  onPageChange,
  showInfo = true,
  itemsPerPage = 15,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 15, 20, 25],
}) => {
  // Calculate visible page numbers
  const getVisiblePages = (): (number | string)[] => {
    const delta = 2; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates
    return rangeWithDots.filter(
      (item, index) => index === 0 || rangeWithDots[index - 1] !== item
    );
  };

  const visiblePages = getVisiblePages();

  // Always show pagination controls, even for single pages
  // This ensures users can see page info and navigation is consistent
  if (totalPages <= 1 && !onItemsPerPageChange && !showInfo) {
    return null;
  }

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem =
    totalCount === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center space-x-4">
        {showInfo && (
          <div className="text-sm text-muted-foreground">
            Showing {startItem} to {endItem} of {totalCount} items
          </div>
        )}

        {onItemsPerPageChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Items per page:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border rounded-md bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "flex items-center justify-center px-3 py-2 text-sm border rounded-md",
            "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary",
            currentPage <= 1 && "opacity-50 cursor-not-allowed hover:bg-transparent"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <div className="flex items-center justify-center px-3 py-2">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    "flex items-center justify-center px-3 py-2 text-sm border rounded-md",
                    "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary",
                    page === currentPage
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border"
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            "flex items-center justify-center px-3 py-2 text-sm border rounded-md",
            "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary",
            currentPage >= totalPages && "opacity-50 cursor-not-allowed hover:bg-transparent"
          )}
        >
          <span className="mr-1 hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
