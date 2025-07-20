import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { User } from "@/utils/type";
import {
  fetchRepositories,
  fetchRepositoryStats,
  initializeRepositories,
  selectRepositories,
  selectRepositoryPagination,
  selectRepositoryStats,
  selectRepositoriesLoading,
  selectRepositoriesError,
  selectRepositoriesInitialized,
  selectCurrentFilter,
  selectCurrentPage,
  selectCurrentLimit,
  setCurrentFilter,
  setCurrentPage,
  setCurrentLimit,
  Repository,
  RepositoryStats,
  PaginationInfo,
} from "@/store/repositoriesSlice";

const useRepositories = (autoFetch: boolean = true, filter: string = "all") => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user) as User | null;
  
  // Redux selectors
  const currentFilter = useSelector((state: RootState) => selectCurrentFilter(state));
  const currentPage = useSelector((state: RootState) => selectCurrentPage(state));
  const currentLimit = useSelector((state: RootState) => selectCurrentLimit(state));
  
  const repositories = useSelector((state: RootState) => 
    selectRepositories(state, currentFilter, currentPage, currentLimit)
  );
  const pagination = useSelector((state: RootState) => 
    selectRepositoryPagination(state, currentFilter, currentPage, currentLimit)
  );
  const stats = useSelector((state: RootState) => selectRepositoryStats(state));
  const loading = useSelector((state: RootState) => selectRepositoriesLoading(state));
  const error = useSelector((state: RootState) => selectRepositoriesError(state));
  const initialized = useSelector((state: RootState) => selectRepositoriesInitialized(state));

  // Wrapper functions for dispatching thunks
  const getRepositories = useCallback(async (params: {
    filter?: string;
    page?: number;
    limit?: number;
    sort?: string;
    direction?: string;
  } = {}): Promise<Repository[]> => {
    const result = await dispatch(fetchRepositories(params));
    if (fetchRepositories.fulfilled.match(result)) {
      return result.payload.data;
    }
    return [];
  }, [dispatch]);

  const getRepositoryStats = useCallback(async (): Promise<RepositoryStats | null> => {
    const result = await dispatch(fetchRepositoryStats());
    if (fetchRepositoryStats.fulfilled.match(result)) {
      return result.payload.data;
    }
    return null;
  }, [dispatch]);

  // Navigation functions
  const changeFilter = useCallback((newFilter: string) => {
    dispatch(setCurrentFilter(newFilter));
    // Fetch first page of new filter
    dispatch(fetchRepositories({ filter: newFilter, page: 1, limit: currentLimit }));
  }, [dispatch, currentLimit]);

  const changePage = useCallback((newPage: number) => {
    dispatch(setCurrentPage(newPage));
    // Fetch new page data
    dispatch(fetchRepositories({ filter: currentFilter, page: newPage, limit: currentLimit }));
  }, [dispatch, currentFilter, currentLimit]);

  const changeLimit = useCallback((newLimit: number) => {
    dispatch(setCurrentLimit(newLimit));
    // Fetch first page with new limit
    dispatch(fetchRepositories({ filter: currentFilter, page: 1, limit: newLimit }));
  }, [dispatch, currentFilter]);

  // Auto-fetch data when user is available and autoFetch is enabled
  useEffect(() => {
    if (user && autoFetch && !initialized) {
      dispatch(initializeRepositories());
    }
  }, [user, autoFetch, initialized, dispatch]);

  // Auto-fetch when filter changes if component specifies a different filter
  useEffect(() => {
    if (user && filter !== currentFilter && autoFetch) {
      changeFilter(filter);
    }
  }, [user, filter, currentFilter, autoFetch, changeFilter]);

  return {
    repositories,
    stats,
    pagination,
    loading,
    error,
    initialized,
    currentFilter,
    currentPage,
    currentLimit,
    getRepositories,
    getRepositoryStats,
    changeFilter,
    changePage,
    changeLimit,
  };
};

export default useRepositories;
export type { Repository, RepositoryStats, PaginationInfo };