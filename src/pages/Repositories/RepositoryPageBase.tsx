import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import RepoCard from "@/components/RepoCard";
import LazyRepoCard from "@/components/LazyRepoCard";
import EnhancedRepoCard from "@/components/EnhancedRepoCard";
import VirtualizedRepositoryGrid from "@/components/VirtualizedRepositoryGrid";
import Pagination from "@/components/ui/pagination";
import ItemsPerPage from "@/components/ui/items-per-page";
import SearchBox from "@/components/SearchBox";
import FilterBar, { FilterOption, ActiveFilter } from "@/components/FilterBar";
import Select from "@/components/ui/select";
import useRepositories from "@/api/useRepositories";
import useWebhooks from "@/api/useWebhooks";
import useWebhookStatus from "@/api/useWebhookStatus";
import useVirtualizedRepositories from "@/hooks/useVirtualizedRepositories";
import { showToast } from "@/lib/toast";
import { Repository } from "@/api/useRepositories";

// Type for repository filter types
export type RepositoryFilterType = "all" | "starred" | "active" | "private" | "public" | "archived" | "forked";

// Page configuration interface
interface PageConfig {
  title: string;
  countLabel: (count: number, pagination: any) => string;
  emptyStateTitle: string;
  emptyStateDescription: string;
}

// Configuration for each repository page type
const pageConfigs: Record<RepositoryFilterType, PageConfig> = {
  all: {
    title: "All Repositories",
    countLabel: (count, pagination) => `${pagination?.totalCount || count} repositories`,
    emptyStateTitle: "No repositories found",
    emptyStateDescription: "Connect with GitHub to see your repositories here."
  },
  starred: {
    title: "Starred Repositories", 
    countLabel: (count, pagination) => `${pagination?.totalCount || count} starred repositories`,
    emptyStateTitle: "No starred repositories found",
    emptyStateDescription: "Star repositories you find interesting to see them here."
  },
  active: {
    title: "Active Repositories",
    countLabel: (count, pagination) => `${pagination?.totalCount || count} repositories (updated in last 6 months)`,
    emptyStateTitle: "No active repositories found", 
    emptyStateDescription: "Repositories are considered active if they were updated in the last 6 months."
  },
  private: {
    title: "Private Repositories",
    countLabel: (count, pagination) => `${pagination?.totalCount || count} private repositories`,
    emptyStateTitle: "No private repositories found",
    emptyStateDescription: "Private repositories are only visible to you and collaborators."
  },
  public: {
    title: "Public Repositories",
    countLabel: (count, pagination) => `${pagination?.totalCount || count} public repositories`, 
    emptyStateTitle: "No public repositories found",
    emptyStateDescription: "Public repositories are visible to everyone on GitHub."
  },
  archived: {
    title: "Archived Repositories",
    countLabel: (count, pagination) => `${pagination?.totalCount || count} archived repositories`,
    emptyStateTitle: "No archived repositories found",
    emptyStateDescription: "Archived repositories are read-only and cannot receive new changes."
  },
  forked: {
    title: "Forked Repositories", 
    countLabel: (count, pagination) => `${pagination?.totalCount || count} forked repositories`,
    emptyStateTitle: "No forked repositories found",
    emptyStateDescription: "Forked repositories are copies of other repositories that you've forked to your account."
  }
};

interface RepositoryPageBaseProps {
  filterType: RepositoryFilterType;
}

export default function RepositoryPageBase({ filterType }: RepositoryPageBaseProps) {
  const {
    repositories: repos,
    pagination,
    loading,
    error,
    changePage,
    changeLimit,
    currentLimit,
    currentPage,
    currentFilter,
  } = useRepositories(true, filterType);
  
  const { createWebhook } = useWebhooks();
  const { getMultipleWebhookStatuses, isWebhookActive, loading: webhookLoading } = useWebhookStatus();
  const [webhookStatusFetched, setWebhookStatusFetched] = useState(false);
  
  // Performance optimization settings
  const [useVirtualization, setUseVirtualization] = useState(() => {
    try {
      return localStorage.getItem("repo-use-virtualization") !== "false";
    } catch {
      return true;
    }
  });
  const [useLazyLoading, setUseLazyLoading] = useState(() => {
    try {
      return localStorage.getItem("repo-use-lazy-loading") !== "false";
    } catch {
      return true;
    }
  });
  const [useEnhancedCards, setUseEnhancedCards] = useState(() => {
    try {
      return localStorage.getItem("repo-use-enhanced-cards") !== "false";
    } catch {
      return true;
    }
  });
  
  // Virtualization setup (will be initialized after filteredRepos is computed)
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced error handling state
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const maxRetries = 3;

  // Search and filtering state with persistence
  const [searchTerm, setSearchTerm] = useState(() => {
    try {
      return localStorage.getItem("repo-search-term") || "";
    } catch {
      return "";
    }
  });
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(() => {
    try {
      const stored = localStorage.getItem("repo-active-filters");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [sortBy, setSortBy] = useState(() => {
    try {
      return localStorage.getItem("repo-sort-by") || "updated";
    } catch {
      return "updated";
    }
  });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(() => {
    try {
      return (localStorage.getItem("repo-sort-direction") as "asc" | "desc") || "desc";
    } catch {
      return "desc";
    }
  });

  // Get page configuration
  const config = pageConfigs[filterType];

  // Generate filter options from repository data
  const filterOptions: FilterOption[] = useMemo(() => {
    if (!repos.length) return [];
    
    const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))].sort();
    const sizes = [
      { label: "Small (< 1MB)", value: "small" },
      { label: "Medium (1-10MB)", value: "medium" },
      { label: "Large (> 10MB)", value: "large" }
    ];
    const activity = [
      { label: "Very Active (< 1 week)", value: "very_active" },
      { label: "Active (< 1 month)", value: "active" },
      { label: "Moderate (< 3 months)", value: "moderate" },
      { label: "Inactive (> 3 months)", value: "inactive" }
    ];

    return [
      ...languages.map(lang => ({
        key: "language",
        label: lang!,
        value: lang!,
        count: repos.filter(repo => repo.language === lang).length
      })),
      ...sizes.map(size => ({
        key: "size",
        label: size.label,
        value: size.value
      })),
      ...activity.map(act => ({
        key: "activity",
        label: act.label,
        value: act.value
      }))
    ];
  }, [repos]);

  // Filter and search repositories
  const filteredRepos = useMemo(() => {
    let filtered = [...repos];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(repo => 
        repo.name.toLowerCase().includes(searchLower) ||
        repo.description?.toLowerCase().includes(searchLower) ||
        repo.language?.toLowerCase().includes(searchLower)
      );
    }

    // Apply active filters
    activeFilters.forEach(filter => {
      switch (filter.key) {
        case "language":
          filtered = filtered.filter(repo => repo.language === filter.value);
          break;
        case "size":
          // Note: GitHub API doesn't provide size, so this is a placeholder
          // In a real implementation, you'd need to add size data
          break;
        case "activity":
          const now = new Date();
          filtered = filtered.filter(repo => {
            const updatedAt = new Date(repo.updated_at);
            const daysDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24);
            
            switch (filter.value) {
              case "very_active": return daysDiff <= 7;
              case "active": return daysDiff <= 30;
              case "moderate": return daysDiff <= 90;
              case "inactive": return daysDiff > 90;
              default: return true;
            }
          });
          break;
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "stars":
          aValue = a.stargazers_count;
          bValue = b.stargazers_count;
          break;
        case "forks":
          aValue = a.forks_count;
          bValue = b.forks_count;
          break;
        case "updated":
        default:
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [repos, searchTerm, activeFilters, sortBy, sortDirection]);

  // Initialize virtualization after filteredRepos is computed
  const {
    shouldUseVirtualization,
    virtualizedProps,
    stats: virtualizationStats,
  } = useVirtualizedRepositories({
    repositories: filteredRepos,
    containerHeight: 600,
    itemHeight: 280,
    threshold: 50,
    enableVirtualization: useVirtualization,
  });

  // Fetch webhook statuses only once when repositories are first loaded
  useEffect(() => {
    if (repos.length > 0 && !webhookStatusFetched) {
      const repoIds = repos.map((repo) => repo.id.toString());
      getMultipleWebhookStatuses(repoIds);
      setWebhookStatusFetched(true);
    }
  }, [repos, getMultipleWebhookStatuses, webhookStatusFetched]);

  // Manual refresh function for webhook statuses
  const refreshWebhookStatus = useCallback(async () => {
    if (repos.length > 0) {
      const repoIds = repos.map((repo) => repo.id.toString());
      await getMultipleWebhookStatuses(repoIds);
      showToast("success", "Webhook statuses refreshed!");
    }
  }, [repos, getMultipleWebhookStatuses]);

  // Enhanced error handling with retry functionality
  const handleRetry = useCallback(async () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setLastError(null);
      
      try {
        // Retry the failed operation
        // This will automatically refetch the current filter data
        window.location.reload();
      } catch (error) {
        setLastError(error instanceof Error ? error.message : "Failed to retry");
      }
    }
  }, [retryCount, maxRetries]);

  const resetErrorState = useCallback(() => {
    setRetryCount(0);
    setLastError(null);
  }, []);

  // Monitor error state changes
  useEffect(() => {
    if (error && error !== lastError) {
      setLastError(error);
      setRetryCount(0);
    } else if (!error && lastError) {
      resetErrorState();
    }
  }, [error, lastError, resetErrorState]);

  // Determine error type for better user messaging
  const getErrorInfo = (errorMessage: string | null) => {
    if (!errorMessage) return null;
    
    const lowerError = errorMessage.toLowerCase();
    
    if (lowerError.includes('network') || lowerError.includes('fetch')) {
      return {
        type: 'network',
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        canRetry: true
      };
    } else if (lowerError.includes('unauthorized') || lowerError.includes('authentication')) {
      return {
        type: 'auth',
        title: 'Authentication Error',
        message: 'Your session has expired. Please log in again.',
        canRetry: false
      };
    } else if (lowerError.includes('rate limit') || lowerError.includes('too many requests')) {
      return {
        type: 'rate_limit',
        title: 'Rate Limit Exceeded',
        message: 'Too many requests. Please wait a moment before trying again.',
        canRetry: true
      };
    } else {
      return {
        type: 'generic',
        title: 'Something went wrong',
        message: errorMessage,
        canRetry: true
      };
    }
  };

  // Search and filter handlers with persistence
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    try {
      localStorage.setItem("repo-search-term", term);
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    if (!value) {
      handleFilterRemove(filterKey);
      return;
    }

    const newFilter: ActiveFilter = {
      key: filterKey,
      label: filterKey.charAt(0).toUpperCase() + filterKey.slice(1).replace('_', ' '),
      value,
      displayValue: filterOptions.find(f => f.key === filterKey && f.value === value)?.label || value
    };

    const newFilters = [
      ...activeFilters.filter(f => f.key !== filterKey),
      newFilter
    ];
    
    setActiveFilters(newFilters);
    try {
      localStorage.setItem("repo-active-filters", JSON.stringify(newFilters));
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleFilterRemove = (filterKey: string) => {
    const newFilters = activeFilters.filter(f => f.key !== filterKey);
    setActiveFilters(newFilters);
    try {
      localStorage.setItem("repo-active-filters", JSON.stringify(newFilters));
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    setSearchTerm("");
    try {
      localStorage.removeItem("repo-active-filters");
      localStorage.removeItem("repo-search-term");
    } catch {
      // Ignore localStorage errors
    }
  };

  const handleSortChange = (sortValue: string) => {
    const [sort, direction] = sortValue.split("-");
    setSortBy(sort);
    setSortDirection(direction as "asc" | "desc");
    try {
      localStorage.setItem("repo-sort-by", sort);
      localStorage.setItem("repo-sort-direction", direction);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Performance optimization handlers
  const toggleVirtualization = useCallback(() => {
    const newValue = !useVirtualization;
    setUseVirtualization(newValue);
    try {
      localStorage.setItem("repo-use-virtualization", newValue.toString());
    } catch {
      // Ignore localStorage errors
    }
    showToast("success", `Virtualization ${newValue ? "enabled" : "disabled"}`);
  }, [useVirtualization]);

  const toggleLazyLoading = useCallback(() => {
    const newValue = !useLazyLoading;
    setUseLazyLoading(newValue);
    try {
      localStorage.setItem("repo-use-lazy-loading", newValue.toString());
    } catch {
      // Ignore localStorage errors
    }
    showToast("success", `Lazy loading ${newValue ? "enabled" : "disabled"}`);
  }, [useLazyLoading]);

  const toggleEnhancedCards = useCallback(() => {
    const newValue = !useEnhancedCards;
    setUseEnhancedCards(newValue);
    try {
      localStorage.setItem("repo-use-enhanced-cards", newValue.toString());
    } catch {
      // Ignore localStorage errors
    }
    showToast("success", `Enhanced cards ${newValue ? "enabled" : "disabled"}`);
  }, [useEnhancedCards]);

  console.log("Debug pagination:", {
    pagination,
    currentPage,
    currentLimit,
    currentFilter,
    repos: repos.length,
    reposData: repos.slice(0, 3).map(r => ({ id: r.id, name: r.name })),
    paginationInfo: pagination ? {
      currentPage: pagination.currentPage,
      totalPages: pagination.totalPages,
      totalCount: pagination.totalCount,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage
    } : null
  });

  // Create webhook for a specific repository
  const handleCreateWebhook = async (repo: Repository) => {
    // Convert Repository to Repo format for webhook creation
    const repoData = {
      id: repo.id.toString(),
      name: repo.name,
      full_name: repo.full_name,
      html_url: repo.html_url,
      description: repo.description || "",
      language: repo.language || "",
      default_branch: "main",
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      clone_url: repo.clone_url,
      forks_count: repo.forks_count,
      stargazers_count: repo.stargazers_count,
      open_issues_count: repo.open_issues_count,
      visibility: repo.private ? "private" : "public",
    };

    const result = await createWebhook(repoData);
    if (result?.message === "Webhook created successfully") {
      showToast("success", "Webhook created successfully!");
    } else {
      showToast("error", result?.message || "Failed to create webhook");
    }
  };

  return (
    <div className="p-6 flex flex-col items-start justify-center gap-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold">{config.title}</h1>
        <div className="text-sm text-muted-foreground">
          {loading ? "Loading..." : config.countLabel(repos.length, pagination)}
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
            <SearchBox
              placeholder="Search repositories by name, description, or language..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full sm:max-w-md"
              size="md"
            />
            <Select
              value={`${sortBy}-${sortDirection}`}
              onValueChange={handleSortChange}
              options={[
                { value: "updated-desc", label: "Latest Updated" },
                { value: "updated-asc", label: "Oldest Updated" },
                { value: "name-asc", label: "Name (A-Z)" },
                { value: "name-desc", label: "Name (Z-A)" },
                { value: "stars-desc", label: "Most Stars" },
                { value: "stars-asc", label: "Least Stars" },
                { value: "forks-desc", label: "Most Forks" },
                { value: "forks-asc", label: "Least Forks" }
              ]}
              placeholder="Sort by"
              className="w-full sm:w-48"
              size="md"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {filterOptions.length > 0 && (
          <FilterBar
            filters={filterOptions}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onFilterRemove={handleFilterRemove}
            onClearAll={handleClearAllFilters}
          />
        )}

        {/* Controls: Items per page and webhook refresh */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <ItemsPerPage
              itemsPerPage={currentLimit}
              onItemsPerPageChange={changeLimit}
              itemsPerPageOptions={[5, 10, 15, 20, 25]}
            />
            <button
              onClick={refreshWebhookStatus}
              disabled={webhookLoading}
              className="px-3 py-1 text-sm border rounded-md bg-background text-foreground border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {webhookLoading ? "Refreshing..." : "Refresh Webhooks"}
            </button>
            
            {/* Performance Controls */}
            {filteredRepos.length > 20 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleVirtualization}
                  className={`px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    useVirtualization
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                  title={`${useVirtualization ? "Disable" : "Enable"} virtualization for large lists`}
                >
                  {shouldUseVirtualization ? "Virtual" : "Standard"}
                </button>
                <button
                  onClick={toggleLazyLoading}
                  className={`px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    useLazyLoading
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                  title={`${useLazyLoading ? "Disable" : "Enable"} lazy loading of repository details`}
                >
                  {useLazyLoading ? "Lazy" : "Eager"}
                </button>
                <button
                  onClick={toggleEnhancedCards}
                  className={`px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                    useEnhancedCards
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                  title={`${useEnhancedCards ? "Disable" : "Enable"} enhanced repository cards`}
                >
                  {useEnhancedCards ? "Enhanced" : "Standard"}
                </button>
              </div>
            )}
          </div>
          
          {/* Results info */}
          <div className="text-sm text-muted-foreground">
            {searchTerm || activeFilters.length > 0 ? (
              <>Showing {filteredRepos.length} of {repos.length} repositories</>
            ) : (
              <>Showing {repos.length} repositories</>
            )}
            {shouldUseVirtualization && (
              <div className="text-xs text-muted-foreground/80 mt-1">
                Rendered: {virtualizationStats.renderedItems} / {virtualizationStats.totalItems}
              </div>
            )}
            {(useLazyLoading || useEnhancedCards) && (
              <div className="text-xs text-muted-foreground/80 mt-1">
                {useLazyLoading && "Lazy loading"}{useLazyLoading && useEnhancedCards && " • "}{useEnhancedCards && "Enhanced cards"}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (() => {
        const errorInfo = getErrorInfo(error);
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
            <div className="mb-4">
              {errorInfo?.type === 'network' && (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              )}
              {errorInfo?.type === 'auth' && (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
              {errorInfo?.type === 'rate_limit' && (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              {(!errorInfo || errorInfo.type === 'generic') && (
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium text-destructive mb-2">
              {errorInfo?.title || "Error loading repositories"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {errorInfo?.message || error}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {errorInfo?.canRetry !== false && retryCount < maxRetries && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  {retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : "Retry"}
                </button>
              )}
              
              {errorInfo?.type === 'auth' && (
                <button
                  onClick={() => window.location.href = '/auth/github'}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                >
                  Login Again
                </button>
              )}
              
              <button
                onClick={resetErrorState}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                Dismiss
              </button>
            </div>
            
            {retryCount >= maxRetries && (
              <p className="text-xs text-muted-foreground mt-4">
                Maximum retry attempts reached. Please refresh the page or contact support if the problem persists.
              </p>
            )}
          </div>
        );
      })()}
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Loading repositories...
          </h3>
        </div>
      )}
      
      {!error && !loading && filteredRepos.length > 0 && (
        <>
          {shouldUseVirtualization ? (
            // Virtualized grid for large lists
            <div ref={gridContainerRef}>
              <VirtualizedRepositoryGrid
                repositories={filteredRepos}
                onCreateWebhook={handleCreateWebhook}
                onDeactivateWebhook={() => {
                  showToast("error", "Webhook deactivation is not supported yet.");
                }}
                isWebhookActive={isWebhookActive}
                containerHeight={virtualizedProps.containerHeight}
                itemHeight={280}
                gap={16}
              />
            </div>
          ) : (
            // Standard grid layout
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
              {filteredRepos.map((repo) => {
                if (useEnhancedCards) {
                  return (
                    <EnhancedRepoCard
                      key={repo.id}
                      data={repo}
                      setActive={() => handleCreateWebhook(repo)}
                      setDeactive={() => {
                        showToast("error", "Webhook deactivation is not supported yet.");
                      }}
                      activated={isWebhookActive(repo.id.toString())}
                      enableLazyLoading={useLazyLoading}
                      showEnhancedDetails={true}
                    />
                  );
                } else if (useLazyLoading) {
                  return (
                    <LazyRepoCard
                      key={repo.id}
                      data={repo}
                      setActive={() => handleCreateWebhook(repo)}
                      setDeactive={() => {
                        showToast("error", "Webhook deactivation is not supported yet.");
                      }}
                      activated={isWebhookActive(repo.id.toString())}
                      onIntersect={(repoId) => {
                        console.log(`Repository ${repoId} became visible`);
                      }}
                    />
                  );
                } else {
                  // Map Repository to ExtendedRepo format for RepoCard compatibility
                  const mappedRepo = {
                    id: repo.id.toString(),
                    name: repo.name,
                    full_name: repo.full_name,
                    html_url: repo.html_url,
                    description: repo.description || "",
                    language: repo.language || "",
                    default_branch: "main",
                    created_at: repo.created_at,
                    updated_at: repo.updated_at,
                    clone_url: repo.clone_url,
                    forks_count: repo.forks_count,
                    stargazers_count: repo.stargazers_count,
                    open_issues_count: repo.open_issues_count,
                    visibility: repo.private ? "private" : "public",
                    private: repo.private,
                    fork: repo.fork,
                    archived: repo.archived,
                    owner: repo.owner,
                  };

                  return (
                    <RepoCard
                      key={repo.id}
                      data={mappedRepo}
                      setActive={() => handleCreateWebhook(repo)}
                      setDeactive={() => {
                        showToast("error", "Webhook deactivation is not supported yet.");
                      }}
                      activated={isWebhookActive(repo.id.toString())}
                    />
                  );
                }
              })}
            </div>
          )}
          
          {/* Performance information */}
          {(shouldUseVirtualization || useLazyLoading || useEnhancedCards) && (
            <div className="flex flex-wrap items-center justify-center gap-4 py-2 text-xs text-muted-foreground bg-muted/50 rounded-lg">
              {shouldUseVirtualization && (
                <span className="flex items-center space-x-1">
                  <span>🚀</span>
                  <span>Virtualization active - showing {virtualizationStats.renderedItems} of {virtualizationStats.totalItems} items</span>
                </span>
              )}
              {useLazyLoading && (
                <span className="flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Lazy loading enabled</span>
                </span>
              )}
              {useEnhancedCards && (
                <span className="flex items-center space-x-1">
                  <span>✨</span>
                  <span>Enhanced cards with detailed info</span>
                </span>
              )}
            </div>
          )}
        </>
      )}
      
      {!error && !loading && filteredRepos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {searchTerm || activeFilters.length > 0 
              ? "No repositories match your search or filters"
              : config.emptyStateTitle
            }
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || activeFilters.length > 0 
              ? "Try adjusting your search terms or clearing filters to see more results."
              : config.emptyStateDescription
            }
          </p>
          {(searchTerm || activeFilters.length > 0) && (
            <button
              onClick={handleClearAllFilters}
              className="px-4 py-2 text-sm border rounded-md bg-background text-foreground border-border hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Clear search and filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={changePage}
          showInfo={true}
          itemsPerPage={currentLimit}
        />
      )}
    </div>
  );
}