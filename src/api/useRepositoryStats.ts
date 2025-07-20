import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { User } from "@/utils/type";
import {
  fetchRepositoryStats,
  selectRepositoryStats,
  selectRepositoriesLoading,
  selectRepositoriesError,
  RepositoryStats,
} from "@/store/repositoriesSlice";

const useRepositoryStats = (autoFetch: boolean = true) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user) as User | null;
  
  // Redux selectors
  const stats = useSelector((state: RootState) => selectRepositoryStats(state));
  const loading = useSelector((state: RootState) => selectRepositoriesLoading(state));
  const error = useSelector((state: RootState) => selectRepositoriesError(state));

  // Wrapper function for dispatching thunk
  const getRepositoryStats = useCallback(async (): Promise<RepositoryStats | null> => {
    const result = await dispatch(fetchRepositoryStats());
    if (fetchRepositoryStats.fulfilled.match(result)) {
      return result.payload.data;
    }
    return null;
  }, [dispatch]);

  // Auto-fetch data when user is available and autoFetch is enabled
  useEffect(() => {
    if (user && autoFetch) {
      dispatch(fetchRepositoryStats());
    }
  }, [user, autoFetch, dispatch]);

  return {
    stats,
    loading,
    error,
    getRepositoryStats,
  };
};

export default useRepositoryStats;