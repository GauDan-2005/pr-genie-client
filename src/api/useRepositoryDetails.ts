import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Interfaces for GitHub API responses
export interface GitHubRepository {
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
  pushed_at: string;
  html_url: string;
  clone_url: string;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  } | null;
  html_url: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed' | 'merged';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  additions?: number;
  deletions?: number;
  changed_files?: number;
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
}

export interface GitHubCollaborator {
  login: string;
  avatar_url: string;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
  role_name: string;
}

export interface GitHubReadme {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  decoded_content: string;
}

interface RepositoryDetailsState {
  details: GitHubRepository | null;
  commits: GitHubCommit[];
  pullRequests: GitHubPullRequest[];
  collaborators: GitHubCollaborator[];
  readme: GitHubReadme | null;
  loading: {
    details: boolean;
    commits: boolean;
    pullRequests: boolean;
    collaborators: boolean;
    readme: boolean;
  };
  error: {
    details: string | null;
    commits: string | null;
    pullRequests: string | null;
    collaborators: string | null;
    readme: string | null;
  };
}

const useRepositoryDetails = (owner: string, name: string) => {
  const [state, setState] = useState<RepositoryDetailsState>({
    details: null,
    commits: [],
    pullRequests: [],
    collaborators: [],
    readme: null,
    loading: {
      details: false,
      commits: false,
      pullRequests: false,
      collaborators: false,
      readme: false,
    },
    error: {
      details: null,
      commits: null,
      pullRequests: null,
      collaborators: null,
      readme: null,
    },
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("userToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchRepositoryDetails = useCallback(async () => {
    if (!owner || !name) return;

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, details: true },
      error: { ...prev.error, details: null },
    }));

    try {
      const response = await axios.get(
        `${BACKEND_URL}/repositories/${owner}/${name}/details`,
        { headers: getAuthHeaders(), withCredentials: true }
      );

      setState(prev => ({
        ...prev,
        details: response.data,
        loading: { ...prev.loading, details: false },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, details: false },
        error: {
          ...prev.error,
          details: error.response?.data?.message || "Failed to fetch repository details",
        },
      }));
    }
  }, [owner, name]);

  const fetchCommits = useCallback(async (page = 1, perPage = 10) => {
    if (!owner || !name) return;

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, commits: true },
      error: { ...prev.error, commits: null },
    }));

    try {
      const response = await axios.get(
        `${BACKEND_URL}/repositories/${owner}/${name}/commits`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
          params: { page, per_page: perPage },
        }
      );

      setState(prev => ({
        ...prev,
        commits: response.data,
        loading: { ...prev.loading, commits: false },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, commits: false },
        error: {
          ...prev.error,
          commits: error.response?.data?.message || "Failed to fetch commits",
        },
      }));
    }
  }, [owner, name]);

  const fetchPullRequests = useCallback(async (state = 'all', page = 1, perPage = 10) => {
    if (!owner || !name) return;

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, pullRequests: true },
      error: { ...prev.error, pullRequests: null },
    }));

    try {
      const response = await axios.get(
        `${BACKEND_URL}/repositories/${owner}/${name}/pulls`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
          params: { state, page, per_page: perPage },
        }
      );

      setState(prev => ({
        ...prev,
        pullRequests: response.data,
        loading: { ...prev.loading, pullRequests: false },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, pullRequests: false },
        error: {
          ...prev.error,
          pullRequests: error.response?.data?.message || "Failed to fetch pull requests",
        },
      }));
    }
  }, [owner, name]);

  const fetchCollaborators = useCallback(async () => {
    if (!owner || !name) return;

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, collaborators: true },
      error: { ...prev.error, collaborators: null },
    }));

    try {
      const response = await axios.get(
        `${BACKEND_URL}/repositories/${owner}/${name}/collaborators`,
        { headers: getAuthHeaders(), withCredentials: true }
      );

      setState(prev => ({
        ...prev,
        collaborators: response.data,
        loading: { ...prev.loading, collaborators: false },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, collaborators: false },
        error: {
          ...prev.error,
          collaborators: error.response?.data?.message || "Failed to fetch collaborators",
        },
      }));
    }
  }, [owner, name]);

  const fetchReadme = useCallback(async () => {
    if (!owner || !name) return;

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, readme: true },
      error: { ...prev.error, readme: null },
    }));

    try {
      const response = await axios.get(
        `${BACKEND_URL}/repositories/${owner}/${name}/readme`,
        { headers: getAuthHeaders(), withCredentials: true }
      );

      setState(prev => ({
        ...prev,
        readme: response.data,
        loading: { ...prev.loading, readme: false },
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, readme: false },
        error: {
          ...prev.error,
          readme: error.response?.data?.message || "Failed to fetch README",
        },
      }));
    }
  }, [owner, name]);

  // Auto-fetch data when owner/name changes
  useEffect(() => {
    if (owner && name) {
      fetchRepositoryDetails();
      fetchCommits();
      fetchPullRequests();
      fetchCollaborators();
      fetchReadme();
    }
  }, [owner, name, fetchRepositoryDetails, fetchCommits, fetchPullRequests, fetchCollaborators, fetchReadme]);

  return {
    ...state,
    refetch: {
      details: fetchRepositoryDetails,
      commits: fetchCommits,
      pullRequests: fetchPullRequests,
      collaborators: fetchCollaborators,
      readme: fetchReadme,
    },
  };
};

export default useRepositoryDetails;