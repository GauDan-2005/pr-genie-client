import { Repo } from "@/utils/type";

// Extended repository type with additional filtering properties
export interface ExtendedRepo extends Repo {
  private: boolean;
  fork: boolean;
  archived: boolean;
  has_issues: boolean;
  has_wiki: boolean;
  has_downloads: boolean;
  pushed_at: string;
  size: number;
  watchers_count: number;
  topics: string[];
  license?: {
    key: string;
    name: string;
  };
  owner: {
    login: string;
    avatar_url: string;
  };
}

// Mock repository data with various properties for filtering
export const mockRepositories: ExtendedRepo[] = [
  {
    id: "1",
    name: "react-dashboard",
    full_name: "user/react-dashboard",
    html_url: "https://github.com/user/react-dashboard",
    description: "A modern React dashboard with TypeScript and Tailwind CSS",
    language: "TypeScript",
    default_branch: "main",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-12-15T16:45:00Z",
    pushed_at: "2024-12-15T16:45:00Z",
    clone_url: "https://github.com/user/react-dashboard.git",
    forks_count: 12,
    stargazers_count: 89,
    watchers_count: 89,
    open_issues_count: 3,
    visibility: "public",
    private: false,
    fork: false,
    archived: false,
    has_issues: true,
    has_wiki: true,
    has_downloads: true,
    size: 2456,
    topics: ["react", "typescript", "dashboard", "tailwindcss"],
    license: {
      key: "mit",
      name: "MIT License"
    },
    owner: {
      login: "user",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: "2",
    name: "python-api",
    full_name: "user/python-api",
    html_url: "https://github.com/user/python-api",
    description: "RESTful API built with FastAPI and PostgreSQL",
    language: "Python",
    default_branch: "main",
    created_at: "2024-02-20T10:15:00Z",
    updated_at: "2024-12-10T14:30:00Z",
    pushed_at: "2024-12-10T14:30:00Z",
    clone_url: "https://github.com/user/python-api.git",
    forks_count: 8,
    stargazers_count: 156,
    watchers_count: 156,
    open_issues_count: 1,
    visibility: "private",
    private: true,
    fork: false,
    archived: false,
    has_issues: true,
    has_wiki: false,
    has_downloads: true,
    size: 1823,
    topics: ["python", "fastapi", "postgresql", "api"],
    license: {
      key: "apache-2.0",
      name: "Apache License 2.0"
    },
    owner: {
      login: "user",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: "3",
    name: "awesome-js-utils",
    full_name: "original-user/awesome-js-utils",
    html_url: "https://github.com/original-user/awesome-js-utils",
    description: "Collection of useful JavaScript utility functions",
    language: "JavaScript",
    default_branch: "master",
    created_at: "2023-08-10T12:00:00Z",
    updated_at: "2024-11-25T09:20:00Z",
    pushed_at: "2024-11-25T09:20:00Z",
    clone_url: "https://github.com/original-user/awesome-js-utils.git",
    forks_count: 234,
    stargazers_count: 1245,
    watchers_count: 1245,
    open_issues_count: 7,
    visibility: "public",
    private: false,
    fork: true,
    archived: false,
    has_issues: true,
    has_wiki: true,
    has_downloads: true,
    size: 892,
    topics: ["javascript", "utilities", "helper-functions"],
    license: {
      key: "mit",
      name: "MIT License"
    },
    owner: {
      login: "original-user",
      avatar_url: "https://avatars.githubusercontent.com/u/67890?v=4"
    }
  },
  {
    id: "4",
    name: "legacy-project",
    full_name: "user/legacy-project",
    html_url: "https://github.com/user/legacy-project",
    description: "Old project that is no longer maintained",
    language: "PHP",
    default_branch: "master",
    created_at: "2022-03-05T14:45:00Z",
    updated_at: "2023-06-15T11:30:00Z",
    pushed_at: "2023-06-15T11:30:00Z",
    clone_url: "https://github.com/user/legacy-project.git",
    forks_count: 2,
    stargazers_count: 23,
    watchers_count: 23,
    open_issues_count: 0,
    visibility: "public",
    private: false,
    fork: false,
    archived: true,
    has_issues: false,
    has_wiki: false,
    has_downloads: false,
    size: 567,
    topics: ["php", "legacy"],
    license: {
      key: "gpl-3.0",
      name: "GNU General Public License v3.0"
    },
    owner: {
      login: "user",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: "5",
    name: "machine-learning-models",
    full_name: "user/machine-learning-models",
    html_url: "https://github.com/user/machine-learning-models",
    description: "Collection of ML models and experiments with TensorFlow",
    language: "Python",
    default_branch: "main",
    created_at: "2024-03-12T16:20:00Z",
    updated_at: "2024-12-14T10:15:00Z",
    pushed_at: "2024-12-14T10:15:00Z",
    clone_url: "https://github.com/user/machine-learning-models.git",
    forks_count: 45,
    stargazers_count: 312,
    watchers_count: 312,
    open_issues_count: 5,
    visibility: "public",
    private: false,
    fork: false,
    archived: false,
    has_issues: true,
    has_wiki: true,
    has_downloads: true,
    size: 5678,
    topics: ["machine-learning", "tensorflow", "python", "ai"],
    owner: {
      login: "user",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: "6",
    name: "secret-config",
    full_name: "user/secret-config",
    html_url: "https://github.com/user/secret-config",
    description: "Private configuration files and deployment scripts",
    language: "Shell",
    default_branch: "main",
    created_at: "2024-05-08T09:30:00Z",
    updated_at: "2024-12-12T15:45:00Z",
    pushed_at: "2024-12-12T15:45:00Z",
    clone_url: "https://github.com/user/secret-config.git",
    forks_count: 0,
    stargazers_count: 0,
    watchers_count: 0,
    open_issues_count: 0,
    visibility: "private",
    private: true,
    fork: false,
    archived: false,
    has_issues: true,
    has_wiki: false,
    has_downloads: false,
    size: 123,
    topics: ["config", "deployment", "scripts"],
    owner: {
      login: "user",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  },
  {
    id: "7",
    name: "vue-components",
    full_name: "community/vue-components",
    html_url: "https://github.com/community/vue-components",
    description: "Reusable Vue.js components library",
    language: "Vue",
    default_branch: "develop",
    created_at: "2023-11-20T13:10:00Z",
    updated_at: "2024-12-08T12:00:00Z",
    pushed_at: "2024-12-08T12:00:00Z",
    clone_url: "https://github.com/community/vue-components.git",
    forks_count: 78,
    stargazers_count: 567,
    watchers_count: 567,
    open_issues_count: 12,
    visibility: "public",
    private: false,
    fork: true,
    archived: false,
    has_issues: true,
    has_wiki: true,
    has_downloads: true,
    size: 3456,
    topics: ["vue", "components", "library", "ui"],
    license: {
      key: "mit",
      name: "MIT License"
    },
    owner: {
      login: "community",
      avatar_url: "https://avatars.githubusercontent.com/u/98765?v=4"
    }
  },
  {
    id: "8",
    name: "docker-templates",
    full_name: "user/docker-templates",
    html_url: "https://github.com/user/docker-templates",
    description: "Ready-to-use Docker templates for various tech stacks",
    language: "Dockerfile",
    default_branch: "main",
    created_at: "2024-07-15T11:25:00Z",
    updated_at: "2024-12-05T08:30:00Z",
    pushed_at: "2024-12-05T08:30:00Z",
    clone_url: "https://github.com/user/docker-templates.git",
    forks_count: 19,
    stargazers_count: 98,
    watchers_count: 98,
    open_issues_count: 2,
    visibility: "public",
    private: false,
    fork: false,
    archived: false,
    has_issues: true,
    has_wiki: false,
    has_downloads: true,
    size: 789,
    topics: ["docker", "templates", "devops", "containers"],
    license: {
      key: "unlicense",
      name: "The Unlicense"
    },
    owner: {
      login: "user",
      avatar_url: "https://avatars.githubusercontent.com/u/12345?v=4"
    }
  }
];

// Starred repositories (subset of repositories that user has starred)
export const starredRepositoryIds = ["1", "3", "5", "7"];

// Helper functions for filtering repositories
export const repositoryFilters = {
  all: (repos: ExtendedRepo[]) => repos,
  
  active: (repos: ExtendedRepo[]) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return repos.filter(repo => 
      !repo.archived && 
      new Date(repo.pushed_at) > sixMonthsAgo
    );
  },
  
  starred: (repos: ExtendedRepo[]) => 
    repos.filter(repo => starredRepositoryIds.includes(repo.id)),
  
  forked: (repos: ExtendedRepo[]) => 
    repos.filter(repo => repo.fork),
  
  private: (repos: ExtendedRepo[]) => 
    repos.filter(repo => repo.private),
  
  public: (repos: ExtendedRepo[]) => 
    repos.filter(repo => !repo.private),
  
  archived: (repos: ExtendedRepo[]) => 
    repos.filter(repo => repo.archived)
};

// Get filtered repositories by type
export const getFilteredRepositories = (filterType: keyof typeof repositoryFilters): ExtendedRepo[] => {
  return repositoryFilters[filterType](mockRepositories);
};

// Get repository statistics
export const getRepositoryStats = (repos: ExtendedRepo[]) => {
  return {
    total: repos.length,
    public: repos.filter(r => !r.private).length,
    private: repos.filter(r => r.private).length,
    forked: repos.filter(r => r.fork).length,
    archived: repos.filter(r => r.archived).length,
    starred: repos.filter(r => starredRepositoryIds.includes(r.id)).length,
    totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    totalForks: repos.reduce((sum, r) => sum + r.forks_count, 0),
    languages: [...new Set(repos.map(r => r.language))].filter(Boolean)
  };
};