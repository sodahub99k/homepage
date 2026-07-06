export interface SodaMeta {
  title: string;
  description: string;
  category: string;
  topics: string[];
  visible: boolean;
  status: string;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  stargazers_count: number;
  default_branch: string;
}

export interface SodaProject {
  repoName: string;
  title: string;
  description: string;
  category: string;
  status: string;
  stars: number;
  gitUrl: string;
  demoUrl: string;
  thumbnailUrl: string;
}

export type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; projects: SodaProject[] };
