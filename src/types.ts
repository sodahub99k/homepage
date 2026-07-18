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

/** A repo whose `.soda/meta.json` is missing or fails schema checks. */
export interface SodaProjectError {
  repoName: string;
  gitUrl: string;
  metaUrl: string;
  messages: string[];
}

export type SodaListItem =
  | { kind: "project"; project: SodaProject }
  | { kind: "error"; error: SodaProjectError };

export type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; items: SodaListItem[] };
