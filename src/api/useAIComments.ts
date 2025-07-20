import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { User } from "@/utils/type";
import {
  fetchAIComments,
  fetchAICommentsStats,
  fetchPullRequestsCount,
  fetchStarredCount,
  initializeAIComments,
  selectAIComments,
  selectAICommentsStats,
  selectPullRequestsCount,
  selectStarredCount,
  selectAICommentsLoading,
  selectAICommentsError,
  selectAICommentsInitialized,
  AIComment,
  AICommentsStats,
  PullRequestsCount,
  StarredCount,
} from "@/store/aiCommentsSlice";
import { adaptBackendComment, adaptBackendStats, AdaptedStats } from "@/services/aiCommentsAdapter";
import { AIComment as FrontendAIComment } from "@/services/mockAIComments";

interface AICommentsFilters {
  status?: string;
  repository?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

interface AICommentsResponse {
  comments: AIComment[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Consolidated AI Comments hook that eliminates redundancy from 3 previous hooks
 * 
 * CONSOLIDATION SUMMARY:
 * - Replaced: useComment.ts (basic callback approach)
 * - Replaced: useAICommentsReal.ts (direct API with useState)  
 * - Replaced: useAIComments.ts (Redux-only approach)
 * 
 * FEATURES:
 * - Redux-based state management with intelligent caching
 * - Configurable data adaptation (backend ↔ frontend format)
 * - Comprehensive error handling and loading states  
 * - Auto-initialization with user authentication
 * - Support for filtering, pagination, and search
 * - Additional metrics (PR count, starred repos count)
 * - Type-safe with full TypeScript support
 * 
 * USAGE:
 * - AI Comments Page: useAIComments({ adaptData: true }) - rich frontend interface
 * - Overview Page: useAIComments({ adaptData: false }) - direct backend data
 * - Custom components: useAIComments({ autoFetch: false }) - manual control
 */
const useAIComments = (options: {
  autoFetch?: boolean;
  adaptData?: boolean;
} = {}) => {
  const { autoFetch = true, adaptData = true } = options;
  
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user) as User | null;
  
  // Redux selectors for backend data
  const backendComments = useSelector((state: RootState) => selectAIComments(state));
  const backendStats = useSelector((state: RootState) => selectAICommentsStats(state));
  const pullRequestsCount = useSelector((state: RootState) => selectPullRequestsCount(state));
  const starredCount = useSelector((state: RootState) => selectStarredCount(state));
  const loading = useSelector((state: RootState) => selectAICommentsLoading(state));
  const error = useSelector((state: RootState) => selectAICommentsError(state));
  const initialized = useSelector((state: RootState) => selectAICommentsInitialized(state));

  // Adapt backend data to frontend format if requested
  const comments: FrontendAIComment[] = adaptData 
    ? backendComments.map(adaptBackendComment)
    : backendComments as unknown as FrontendAIComment[];

  const stats: AdaptedStats | AICommentsStats | null = adaptData && backendStats 
    ? adaptBackendStats(backendStats)
    : backendStats;

  // Main function to fetch comments with filtering
  const getComments = useCallback(async (filters: AICommentsFilters = {}): Promise<FrontendAIComment[]> => {
    const result = await dispatch(fetchAIComments(filters));
    if (fetchAIComments.fulfilled.match(result)) {
      const fetchedComments = result.payload.data;
      return adaptData 
        ? fetchedComments.map(adaptBackendComment)
        : fetchedComments as unknown as FrontendAIComment[];
    }
    return [];
  }, [dispatch, adaptData]);

  // Fetch statistics
  const getStats = useCallback(async () => {
    const result = await dispatch(fetchAICommentsStats());
    if (fetchAICommentsStats.fulfilled.match(result)) {
      const fetchedStats = result.payload.data;
      return adaptData 
        ? adaptBackendStats(fetchedStats)
        : fetchedStats;
    }
    return null;
  }, [dispatch, adaptData]);

  // Fetch pull requests count
  const getPullRequestsCount = useCallback(async (): Promise<PullRequestsCount | null> => {
    const result = await dispatch(fetchPullRequestsCount());
    if (fetchPullRequestsCount.fulfilled.match(result)) {
      return result.payload.data;
    }
    return null;
  }, [dispatch]);

  // Fetch starred repositories count
  const getStarredCount = useCallback(async (): Promise<StarredCount | null> => {
    const result = await dispatch(fetchStarredCount());
    if (fetchStarredCount.fulfilled.match(result)) {
      return result.payload.data;
    }
    return null;
  }, [dispatch]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      getComments(),
      getStats(),
      getPullRequestsCount(),
      getStarredCount(),
    ]);
  }, [getComments, getStats, getPullRequestsCount, getStarredCount]);

  // Auto-fetch data when user is available and autoFetch is enabled
  useEffect(() => {
    if (user && autoFetch && !initialized) {
      dispatch(initializeAIComments());
    }
  }, [user, autoFetch, initialized, dispatch]);

  return {
    // Adapted data (for components expecting frontend format)
    comments,
    stats,
    
    // Raw backend data (for components that can work with backend format)
    backendComments,
    backendStats,
    
    // Additional metrics
    pullRequestsCount,
    starredCount,
    
    // State indicators
    loading,
    error,
    initialized,
    
    // Action functions
    getComments,
    getStats,
    getPullRequestsCount,
    getStarredCount,
    refreshAll,
  };
};

export default useAIComments;
export type { 
  AIComment, 
  FrontendAIComment,
  AICommentsResponse, 
  AICommentsStats,
  AdaptedStats,
  PullRequestsCount,
  StarredCount,
  AICommentsFilters
};