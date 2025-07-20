import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import RepoCard from '@/components/RepoCard';
import { Repository } from '@/api/useRepositories';

interface VirtualizedRepositoryGridProps {
  repositories: Repository[];
  onCreateWebhook: (repo: Repository) => void;
  onDeactivateWebhook: (repo: Repository) => void;
  isWebhookActive: (repoId: string) => boolean;
  itemHeight?: number;
  containerHeight?: number;
  columns?: number;
  gap?: number;
}

interface ExtendedRepo {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  language: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
  clone_url: string;
  forks_count: number;
  stargazers_count: number;
  open_issues_count: number;
  visibility: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const VirtualizedRepositoryGrid: React.FC<VirtualizedRepositoryGridProps> = ({
  repositories,
  onCreateWebhook,
  onDeactivateWebhook,
  isWebhookActive,
  itemHeight = 280,
  containerHeight = 600,
  columns = 4,
  gap = 16,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate responsive columns based on container width
  const responsiveColumns = useMemo(() => {
    if (containerWidth < 640) return 1; // sm
    if (containerWidth < 768) return 2; // md
    if (containerWidth < 1024) return 3; // lg
    return columns; // xl and above
  }, [containerWidth, columns]);

  // Calculate item dimensions
  const itemWidth = useMemo(() => {
    const totalGapWidth = (responsiveColumns - 1) * gap;
    return (containerWidth - totalGapWidth) / responsiveColumns;
  }, [containerWidth, responsiveColumns, gap]);
  
  // Use itemWidth in grid template columns
  const gridTemplateColumns = `repeat(${responsiveColumns}, ${itemWidth > 0 ? `${itemWidth}px` : '1fr'})`;

  const rowHeight = itemHeight + gap;

  // Calculate which items should be visible
  const visibleRange = useMemo(() => {
    const totalRows = Math.ceil(repositories.length / responsiveColumns);
    const visibleStartRow = Math.floor(scrollTop / rowHeight);
    const visibleEndRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + containerHeight) / rowHeight)
    );

    // Add buffer rows for smoother scrolling
    const bufferRows = 2;
    const startRow = Math.max(0, visibleStartRow - bufferRows);
    const endRow = Math.min(totalRows - 1, visibleEndRow + bufferRows);

    const startIndex = startRow * responsiveColumns;
    const endIndex = Math.min(repositories.length - 1, (endRow + 1) * responsiveColumns - 1);

    return {
      startIndex,
      endIndex,
      startRow,
      endRow,
      totalRows,
    };
  }, [scrollTop, containerHeight, rowHeight, repositories.length, responsiveColumns]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return repositories.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [repositories, visibleRange.startIndex, visibleRange.endIndex]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Handle container resize
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  // Map Repository to ExtendedRepo format
  const mapRepository = useCallback((repo: Repository): ExtendedRepo => ({
    id: repo.id.toString(),
    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,
    description: repo.description || '',
    language: repo.language || '',
    default_branch: 'main',
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    clone_url: repo.clone_url,
    forks_count: repo.forks_count,
    stargazers_count: repo.stargazers_count,
    open_issues_count: repo.open_issues_count,
    visibility: repo.private ? 'private' : 'public',
    private: repo.private,
    fork: repo.fork,
    archived: repo.archived,
    owner: repo.owner,
  }), []);

  // Calculate total height for scrollbar
  const totalHeight = visibleRange.totalRows * rowHeight;

  // Calculate offset for visible items
  const offsetY = visibleRange.startRow * rowHeight;

  if (repositories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No repositories to display</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto border rounded-lg bg-background"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {/* Total container to create scrollbar */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items container */}
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0,
            display: 'grid',
            gridTemplateColumns: gridTemplateColumns,
            gap: `${gap}px`,
            padding: `${gap / 2}px`,
          }}
        >
          {visibleItems.map((repo, index) => {
            const mappedRepo = mapRepository(repo);
            const globalIndex = visibleRange.startIndex + index;

            return (
              <div
                key={repo.id}
                style={{
                  height: itemHeight,
                  minHeight: itemHeight,
                }}
                data-index={globalIndex}
              >
                <RepoCard
                  data={mappedRepo}
                  setActive={() => onCreateWebhook(repo)}
                  setDeactive={() => onDeactivateWebhook(repo)}
                  activated={isWebhookActive(repo.id.toString())}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading indicator for scroll */}
      {visibleItems.length > 0 && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Showing {visibleRange.startIndex + 1}-{visibleRange.endIndex + 1} of {repositories.length}
        </div>
      )}
    </div>
  );
};

export default VirtualizedRepositoryGrid;