import { useState, useEffect, useMemo, useCallback } from 'react';
import { Repository } from '@/api/useRepositories';

interface UseVirtualizedRepositoriesProps {
  repositories: Repository[];
  containerHeight?: number;
  itemHeight?: number;
  threshold?: number;
  enableVirtualization?: boolean;
}

interface VirtualizationState {
  scrollTop: number;
  containerWidth: number;
  isScrolling: boolean;
}

interface VirtualizedResult {
  shouldUseVirtualization: boolean;
  visibleRepositories: Repository[];
  virtualizedProps: {
    containerHeight: number;
    totalHeight: number;
    offsetY: number;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  };
  stats: {
    totalItems: number;
    visibleStart: number;
    visibleEnd: number;
    renderedItems: number;
  };
}

const useVirtualizedRepositories = ({
  repositories,
  containerHeight = 600,
  itemHeight = 280,
  threshold = 50,
  enableVirtualization = true,
}: UseVirtualizedRepositoriesProps): VirtualizedResult => {
  const [virtualizationState, setVirtualizationState] = useState<VirtualizationState>({
    scrollTop: 0,
    containerWidth: 0,
    isScrolling: false,
  });

  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Determine if virtualization should be used
  const shouldUseVirtualization = useMemo(() => {
    return enableVirtualization && repositories.length > threshold;
  }, [enableVirtualization, repositories.length, threshold]);

  // Calculate responsive columns based on container width
  const columns = useMemo(() => {
    const { containerWidth } = virtualizationState;
    if (containerWidth < 640) return 1; // sm
    if (containerWidth < 768) return 2; // md
    if (containerWidth < 1024) return 3; // lg
    return 4; // xl and above
  }, [virtualizationState.containerWidth]);

  // Calculate visible range for virtualization
  const visibleRange = useMemo(() => {
    if (!shouldUseVirtualization) {
      return {
        startIndex: 0,
        endIndex: repositories.length - 1,
        startRow: 0,
        endRow: Math.ceil(repositories.length / columns) - 1,
        totalRows: Math.ceil(repositories.length / columns),
      };
    }

    const { scrollTop } = virtualizationState;
    const gap = 16;
    const rowHeight = itemHeight + gap;
    const totalRows = Math.ceil(repositories.length / columns);

    // Calculate visible rows
    const visibleStartRow = Math.floor(scrollTop / rowHeight);
    const visibleEndRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + containerHeight) / rowHeight)
    );

    // Add buffer rows for smoother scrolling
    const bufferRows = 2;
    const startRow = Math.max(0, visibleStartRow - bufferRows);
    const endRow = Math.min(totalRows - 1, visibleEndRow + bufferRows);

    // Calculate item indices
    const startIndex = startRow * columns;
    const endIndex = Math.min(repositories.length - 1, (endRow + 1) * columns - 1);

    return {
      startIndex,
      endIndex,
      startRow,
      endRow,
      totalRows,
    };
  }, [
    shouldUseVirtualization,
    repositories.length,
    virtualizationState.scrollTop,
    containerHeight,
    itemHeight,
    columns,
  ]);

  // Get visible repositories
  const visibleRepositories = useMemo(() => {
    if (!shouldUseVirtualization) {
      return repositories;
    }

    return repositories.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [shouldUseVirtualization, repositories, visibleRange.startIndex, visibleRange.endIndex]);

  // Handle scroll events with throttling
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    
    setVirtualizationState(prev => ({
      ...prev,
      scrollTop,
      isScrolling: true,
    }));

    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Set isScrolling to false after scroll ends
    const newTimeout = setTimeout(() => {
      setVirtualizationState(prev => ({
        ...prev,
        isScrolling: false,
      }));
    }, 150);

    setScrollTimeout(newTimeout);
  }, [scrollTimeout]);

  // Calculate total height and offset
  const totalHeight = useMemo(() => {
    const gap = 16;
    const rowHeight = itemHeight + gap;
    return visibleRange.totalRows * rowHeight;
  }, [visibleRange.totalRows, itemHeight]);

  const offsetY = useMemo(() => {
    if (!shouldUseVirtualization) return 0;
    const gap = 16;
    const rowHeight = itemHeight + gap;
    return visibleRange.startRow * rowHeight;
  }, [shouldUseVirtualization, visibleRange.startRow, itemHeight]);

  // Update container width method (to be called by parent)
  const updateContainerWidth = useCallback((width: number) => {
    setVirtualizationState(prev => ({
      ...prev,
      containerWidth: width,
    }));
  }, []);

  // Handle container width updates
  useEffect(() => {
    const handleResize = () => {
      // This could be enhanced to actually detect container width changes
      // For now, we'll update with a default responsive calculation
      const newWidth = window.innerWidth;
      updateContainerWidth(newWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateContainerWidth]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return {
    shouldUseVirtualization,
    visibleRepositories,
    virtualizedProps: {
      containerHeight: shouldUseVirtualization ? containerHeight : 'auto' as any,
      totalHeight,
      offsetY,
      onScroll: handleScroll,
    },
    stats: {
      totalItems: repositories.length,
      visibleStart: visibleRange.startIndex,
      visibleEnd: visibleRange.endIndex,
      renderedItems: visibleRepositories.length,
    },
  };
};

export default useVirtualizedRepositories;
export type { VirtualizedResult, VirtualizationState };