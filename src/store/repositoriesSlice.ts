import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Repository interface matching API response
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  html_url: string;
  clone_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface RepositoryStats {
  total: number;
  public: number;
  private: number;
  forked: number;
  archived: number;
  totalStars: number;
  totalForks: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface RepositoriesState {
  repositories: {
    [filter: string]: {
      [page: string]: {
        [limit: string]: {
          data: Repository[];
          pagination: PaginationInfo;
          timestamp: number;
        };
      };
    };
  };
  stats: {
    data: RepositoryStats | null;
    timestamp: number;
  };
  loading: {
    repositories: boolean;
    stats: boolean;
  };
  error: {
    repositories: string | null;
    stats: string | null;
  };
  initialized: boolean;
  currentFilter: string;
  currentPage: number;
  currentLimit: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: RepositoriesState = {
  repositories: {},
  stats: {
    data: null,
    timestamp: 0,
  },
  loading: {
    repositories: false,
    stats: false,
  },
  error: {
    repositories: null,
    stats: null,
  },
  initialized: false,
  currentFilter: "all",
  currentPage: 1,
  currentLimit: 15,
};

// Helper function to check cache validity
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Async thunk for fetching repositories with pagination
export const fetchRepositories = createAsyncThunk(
  "repositories/fetchRepositories",
  async (
    params: {
      filter?: string;
      page?: number;
      limit?: number;
      sort?: string;
      direction?: string;
    } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const {
        filter = "all",
        page = 1,
        limit = 15,
        sort = "updated",
        direction = "desc",
      } = params;

      const state = getState() as { repositories: RepositoriesState };
      const cached =
        state.repositories.repositories[filter]?.[page.toString()]?.[
          limit.toString()
        ];

      // Return cached data if valid
      if (cached && isCacheValid(cached.timestamp)) {
        return {
          filter,
          page,
          limit,
          data: cached.data,
          pagination: cached.pagination,
          fromCache: true,
        };
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sort,
        direction,
      });

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/repositories/${filter}?${queryParams.toString()}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        return {
          filter,
          page,
          limit,
          data: response.data.repositories,
          pagination: response.data.pagination,
          fromCache: false,
        };
      }

      return rejectWithValue("Failed to fetch repositories");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch repositories";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching repository stats
export const fetchRepositoryStats = createAsyncThunk(
  "repositories/fetchRepositoryStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { repositories: RepositoriesState };

      // Return cached data if valid
      if (
        state.repositories.stats.data &&
        isCacheValid(state.repositories.stats.timestamp)
      ) {
        return { data: state.repositories.stats.data, fromCache: true };
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/repositories/stats`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        return { data: response.data, fromCache: false };
      }

      return rejectWithValue("Failed to fetch repository statistics");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch repository statistics";
      return rejectWithValue(message);
    }
  }
);

// Initialize repositories data (fetch all repos and stats)
export const initializeRepositories = createAsyncThunk(
  "repositories/initialize",
  async (_, { dispatch, getState }) => {
    const state = getState() as { repositories: RepositoriesState };

    if (!state.repositories.initialized) {
      await Promise.all([
        dispatch(fetchRepositories({ filter: "all", page: 1 })),
        dispatch(fetchRepositoryStats()),
      ]);
    }
  }
);

const repositoriesSlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    clearRepositoriesCache: (state) => {
      state.repositories = {};
      state.stats = { data: null, timestamp: 0 };
    },
    clearRepositoriesError: (state) => {
      state.error.repositories = null;
      state.error.stats = null;
    },
    setCurrentFilter: (state, action: PayloadAction<string>) => {
      state.currentFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setCurrentLimit: (state, action: PayloadAction<number>) => {
      const newLimit = action.payload;
      const currentFilter = state.currentFilter;
      
      // Clear cache for the current filter since we're changing the limit
      if (state.repositories[currentFilter]) {
        delete state.repositories[currentFilter];
      }
      
      state.currentLimit = newLimit;
      state.currentPage = 1; // Reset to first page when limit changes
    },
  },
  extraReducers: (builder) => {
    // Fetch repositories
    builder
      .addCase(fetchRepositories.pending, (state) => {
        state.loading.repositories = true;
        state.error.repositories = null;
      })
      .addCase(fetchRepositories.fulfilled, (state, action) => {
        state.loading.repositories = false;
        const { filter, page, limit, data, pagination, fromCache } =
          action.payload;

        if (!fromCache) {
          if (!state.repositories[filter]) {
            state.repositories[filter] = {};
          }
          if (!state.repositories[filter][page.toString()]) {
            state.repositories[filter][page.toString()] = {};
          }
          state.repositories[filter][page.toString()][limit.toString()] = {
            data,
            pagination,
            timestamp: Date.now(),
          };
        }

        // Update current filter, page, and limit
        state.currentFilter = filter;
        state.currentPage = page;
        state.currentLimit = limit;
      })
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.loading.repositories = false;
        state.error.repositories = action.payload as string;
      });

    // Fetch repository stats
    builder
      .addCase(fetchRepositoryStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchRepositoryStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        const { data, fromCache } = action.payload;

        if (!fromCache) {
          state.stats = {
            data,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(fetchRepositoryStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.payload as string;
      });

    // Initialize repositories
    builder.addCase(initializeRepositories.fulfilled, (state) => {
      state.initialized = true;
    });
  },
});

export const {
  clearRepositoriesCache,
  clearRepositoriesError,
  setCurrentFilter,
  setCurrentPage,
  setCurrentLimit,
} = repositoriesSlice.actions;
export default repositoriesSlice.reducer;

// Selectors
export const selectRepositories = (
  state: { repositories: RepositoriesState },
  filter: string = "all",
  page: number = 1,
  limit: number = 15
) =>
  state.repositories.repositories[filter]?.[page.toString()]?.[limit.toString()]
    ?.data || [];

export const selectRepositoryPagination = (
  state: { repositories: RepositoriesState },
  filter: string = "all",
  _page: number = 1,
  limit: number = 15
) => {
  // Try to find pagination data for this filter/limit combination from any page
  const filterCache = state.repositories.repositories[filter];
  if (!filterCache) return null;

  let cachedPagination = null;
  
  // Look for pagination data in any page for this filter/limit
  for (const pageKey of Object.keys(filterCache)) {
    const limitCache = filterCache[pageKey]?.[limit.toString()];
    if (limitCache?.pagination) {
      cachedPagination = limitCache.pagination;
      break;
    }
  }

  if (!cachedPagination) return null;

  // Always use the current page from Redux state for UI consistency
  return {
    ...cachedPagination,
    currentPage: state.repositories.currentPage,
  };
};

export const selectRepositoryStats = (state: {
  repositories: RepositoriesState;
}) => state.repositories.stats.data;

export const selectRepositoriesLoading = (state: {
  repositories: RepositoriesState;
}) =>
  state.repositories.loading.repositories || state.repositories.loading.stats;

export const selectRepositoriesError = (state: {
  repositories: RepositoriesState;
}) => state.repositories.error.repositories || state.repositories.error.stats;

export const selectRepositoriesInitialized = (state: {
  repositories: RepositoriesState;
}) => state.repositories.initialized;

export const selectCurrentFilter = (state: {
  repositories: RepositoriesState;
}) => state.repositories.currentFilter;

export const selectCurrentPage = (state: { repositories: RepositoriesState }) =>
  state.repositories.currentPage;

export const selectCurrentLimit = (state: {
  repositories: RepositoriesState;
}) => state.repositories.currentLimit;
