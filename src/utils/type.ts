type Repo = {
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
};

type User = {
  _id: string;
  aiComments: any[];
  avatarUrl: string;
  createdAt: string;
  githubId: string;
  name: string;
  profileUrl: string;
  publicRepos: number;
  following: number;
  followers: number;
  repository: string[];
  token: string;
  updatedAt: string;
  username: string;
  __v: number;
};

export type { Repo, User };
