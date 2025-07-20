import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface AIComment {
  id: string;
  repositoryName: string;
  pullRequestId: string;
  comment: string;
  branch: string;
  createdAt: string;
  status: string;
  type: string;
}

export interface AICommentsStats {
  totalComments: number;
  recentComments: number;
  averagePerDay: number;
  repositoriesWithComments: number;
}

export interface PullRequestsCount {
  totalOpenPRs: number;
  repositories: number;
}

export interface StarredCount {
  totalStarred: number;
  message: string;
}

interface AICommentsState {
  comments: {
    data: AIComment[];
    timestamp: number;
    filters?: string;
  } | null;
  stats: {
    data: AICommentsStats | null;
    timestamp: number;
  };
  pullRequests: {
    data: PullRequestsCount | null;
    timestamp: number;
  };
  starred: {
    data: StarredCount | null;
    timestamp: number;
  };
  loading: {
    comments: boolean;
    stats: boolean;
    pullRequests: boolean;
    starred: boolean;
  };
  error: {
    comments: string | null;
    stats: string | null;
    pullRequests: string | null;
    starred: string | null;
  };
  initialized: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState: AICommentsState = {
  comments: null,
  stats: {
    data: null,
    timestamp: 0,
  },
  pullRequests: {
    data: null,
    timestamp: 0,
  },
  starred: {
    data: null,
    timestamp: 0,
  },
  loading: {
    comments: false,
    stats: false,
    pullRequests: false,
    starred: false,
  },
  error: {
    comments: null,
    stats: null,
    pullRequests: null,
    starred: null,
  },
  initialized: false,
};

// Helper function to check cache validity
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Async thunk for fetching AI comments
export const fetchAIComments = createAsyncThunk(
  "aiComments/fetchAIComments",
  async (filters: {
    status?: string;
    repository?: string;
    type?: string;
    limit?: number;
    offset?: number;
  } = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { aiComments: AICommentsState };
      const filtersKey = JSON.stringify(filters || {});
      
      // Check cache for basic queries only (no complex filters)
      if (!filters || Object.keys(filters).length === 0) {
        if (state.aiComments.comments && isCacheValid(state.aiComments.comments.timestamp)) {
          return { data: state.aiComments.comments.data, fromCache: true };
        }
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.repository) params.append("repository", filters.repository);
      if (filters?.type) params.append("type", filters.type);
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ai-comments?${params.toString()}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        return { 
          data: response.data.comments, 
          fromCache: false,
          cacheKey: filtersKey,
          shouldCache: !filters || Object.keys(filters).length === 0
        };
      }
      
      return rejectWithValue("Failed to fetch AI comments");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to fetch AI comments";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching AI comments stats
export const fetchAICommentsStats = createAsyncThunk(
  "aiComments/fetchAICommentsStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { aiComments: AICommentsState };
      
      // Return cached data if valid
      if (state.aiComments.stats.data && isCacheValid(state.aiComments.stats.timestamp)) {
        return { data: state.aiComments.stats.data, fromCache: true };
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ai-comments/stats`,
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
      
      return rejectWithValue("Failed to fetch AI comments statistics");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to fetch AI comments statistics";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching pull requests count
export const fetchPullRequestsCount = createAsyncThunk(
  "aiComments/fetchPullRequestsCount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { aiComments: AICommentsState };
      
      // Return cached data if valid
      if (state.aiComments.pullRequests.data && isCacheValid(state.aiComments.pullRequests.timestamp)) {
        return { data: state.aiComments.pullRequests.data, fromCache: true };
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/repositories/pull-requests/count`,
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
      
      return rejectWithValue("Failed to fetch pull requests count");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to fetch pull requests count";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for fetching starred repositories count
export const fetchStarredCount = createAsyncThunk(
  "aiComments/fetchStarredCount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { aiComments: AICommentsState };
      
      // Return cached data if valid
      if (state.aiComments.starred.data && isCacheValid(state.aiComments.starred.timestamp)) {
        return { data: state.aiComments.starred.data, fromCache: true };
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/repositories/starred/count`,
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
      
      return rejectWithValue("Failed to fetch starred repositories count");
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Failed to fetch starred repositories count";
      return rejectWithValue(message);
    }
  }
);

// Initialize AI comments data
export const initializeAIComments = createAsyncThunk(
  "aiComments/initialize",
  async (_, { dispatch, getState }) => {
    const state = getState() as { aiComments: AICommentsState };
    
    if (!state.aiComments.initialized) {
      await Promise.all([
        dispatch(fetchAICommentsStats()),
        dispatch(fetchPullRequestsCount()),
        dispatch(fetchStarredCount()),
      ]);
    }
  }
);

const aiCommentsSlice = createSlice({
  name: "aiComments",
  initialState,
  reducers: {
    clearAICommentsCache: (state) => {
      state.comments = null;
      state.stats = { data: null, timestamp: 0 };
      state.pullRequests = { data: null, timestamp: 0 };
    },
    clearAICommentsError: (state) => {
      state.error.comments = null;
      state.error.stats = null;
      state.error.pullRequests = null;
      state.error.starred = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch AI comments
    builder
      .addCase(fetchAIComments.pending, (state) => {
        state.loading.comments = true;
        state.error.comments = null;
      })
      .addCase(fetchAIComments.fulfilled, (state, action) => {
        state.loading.comments = false;
        const { data, fromCache, cacheKey, shouldCache } = action.payload;
        
        if (!fromCache && shouldCache) {
          state.comments = {
            data,
            timestamp: Date.now(),
            filters: cacheKey,
          };
        }
      })
      .addCase(fetchAIComments.rejected, (state, action) => {
        state.loading.comments = false;
        state.error.comments = action.payload as string;
      });

    // Fetch AI comments stats
    builder
      .addCase(fetchAICommentsStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchAICommentsStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        const { data, fromCache } = action.payload;
        
        if (!fromCache) {
          state.stats = {
            data,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(fetchAICommentsStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.payload as string;
      });

    // Fetch pull requests count
    builder
      .addCase(fetchPullRequestsCount.pending, (state) => {
        state.loading.pullRequests = true;
        state.error.pullRequests = null;
      })
      .addCase(fetchPullRequestsCount.fulfilled, (state, action) => {
        state.loading.pullRequests = false;
        const { data, fromCache } = action.payload;
        
        if (!fromCache) {
          state.pullRequests = {
            data,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(fetchPullRequestsCount.rejected, (state, action) => {
        state.loading.pullRequests = false;
        state.error.pullRequests = action.payload as string;
      });

    // Fetch starred count
    builder
      .addCase(fetchStarredCount.pending, (state) => {
        state.loading.starred = true;
        state.error.starred = null;
      })
      .addCase(fetchStarredCount.fulfilled, (state, action) => {
        state.loading.starred = false;
        const { data, fromCache } = action.payload;
        
        if (!fromCache) {
          state.starred = {
            data,
            timestamp: Date.now(),
          };
        }
      })
      .addCase(fetchStarredCount.rejected, (state, action) => {
        state.loading.starred = false;
        state.error.starred = action.payload as string;
      });

    // Initialize AI comments
    builder
      .addCase(initializeAIComments.fulfilled, (state) => {
        state.initialized = true;
      });
  },
});

export const { clearAICommentsCache, clearAICommentsError } = aiCommentsSlice.actions;
export default aiCommentsSlice.reducer;

// Selectors
export const selectAIComments = (state: { aiComments: AICommentsState }) => 
  state.aiComments.comments?.data || [];

export const selectAICommentsStats = (state: { aiComments: AICommentsState }) => 
  state.aiComments.stats.data;

export const selectPullRequestsCount = (state: { aiComments: AICommentsState }) => 
  state.aiComments.pullRequests.data;

export const selectStarredCount = (state: { aiComments: AICommentsState }) => 
  state.aiComments.starred.data;

export const selectAICommentsLoading = (state: { aiComments: AICommentsState }) => 
  state.aiComments.loading.comments || state.aiComments.loading.stats || state.aiComments.loading.pullRequests || state.aiComments.loading.starred;

export const selectAICommentsError = (state: { aiComments: AICommentsState }) => 
  state.aiComments.error.comments || state.aiComments.error.stats || state.aiComments.error.pullRequests || state.aiComments.error.starred;

export const selectAICommentsInitialized = (state: { aiComments: AICommentsState }) => 
  state.aiComments.initialized;