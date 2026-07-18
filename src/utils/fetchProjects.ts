import type {
  GitHubRepo,
  SodaListItem,
  SodaMeta,
  SodaProject,
  SodaProjectError,
} from "../types";
import {
  demoUrl,
  deriveOwner,
  githubApiHeaders,
  metaUrl,
  PLACEHOLDER_THUMBNAIL,
  thumbnailUrl,
} from "./urls";

const REQUIRED_KEYS = [
  "title",
  "description",
  "category",
  "topics",
  "visible",
  "status",
] as const satisfies readonly (keyof SodaMeta)[];

type MetaFetchResult =
  | { status: "missing"; url: string }
  | { status: "error"; url: string; messages: string[] }
  | { status: "ok"; url: string; meta: SodaMeta };

function typeLabel(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/** Validate raw JSON against the SodaMeta schema; returns detailed messages. */
export function validateSodaMeta(data: unknown): string[] {
  const messages: string[] = [];

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    messages.push(
      `meta.json must be a JSON object, got ${typeLabel(data)}`,
    );
    return messages;
  }

  const obj = data as Record<string, unknown>;

  for (const key of REQUIRED_KEYS) {
    if (!(key in obj)) {
      messages.push(`missing required key "${key}"`);
    }
  }

  if ("title" in obj && typeof obj.title !== "string") {
    messages.push(`"title" must be string, got ${typeLabel(obj.title)}`);
  } else if (typeof obj.title === "string" && obj.title.trim() === "") {
    messages.push(`"title" must be a non-empty string`);
  }

  if ("description" in obj && typeof obj.description !== "string") {
    messages.push(
      `"description" must be string, got ${typeLabel(obj.description)}`,
    );
  }

  if ("category" in obj && typeof obj.category !== "string") {
    messages.push(
      `"category" must be string, got ${typeLabel(obj.category)}`,
    );
  } else if (typeof obj.category === "string" && obj.category.trim() === "") {
    messages.push(`"category" must be a non-empty string`);
  }

  if ("topics" in obj) {
    if (!Array.isArray(obj.topics)) {
      messages.push(`"topics" must be an array, got ${typeLabel(obj.topics)}`);
    } else {
      const bad = obj.topics.findIndex((t) => typeof t !== "string");
      if (bad !== -1) {
        messages.push(
          `"topics[${bad}]" must be string, got ${typeLabel(obj.topics[bad])}`,
        );
      }
    }
  }

  if ("visible" in obj && typeof obj.visible !== "boolean") {
    messages.push(
      `"visible" must be boolean, got ${typeLabel(obj.visible)}`,
    );
  }

  if ("status" in obj && typeof obj.status !== "string") {
    messages.push(`"status" must be string, got ${typeLabel(obj.status)}`);
  } else if (typeof obj.status === "string" && obj.status.trim() === "") {
    messages.push(`"status" must be a non-empty string`);
  }

  return messages;
}

async function fetchMeta(
  owner: string,
  repo: GitHubRepo,
): Promise<MetaFetchResult> {
  const url = metaUrl(owner, repo.name, repo.default_branch);

  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      status: "error",
      url,
      messages: [`failed to fetch meta.json: ${detail}`],
    };
  }

  if (res.status === 404) {
    return { status: "missing", url };
  }

  if (!res.ok) {
    return {
      status: "error",
      url,
      messages: [
        `failed to fetch meta.json (HTTP ${res.status} ${res.statusText || ""})`.trim(),
      ],
    };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return {
      status: "error",
      url,
      messages: [`meta.json is not valid JSON: ${detail}`],
    };
  }

  const messages = validateSodaMeta(data);
  if (messages.length > 0) {
    return { status: "error", url, messages };
  }

  return { status: "ok", url, meta: data as SodaMeta };
}

async function resolveThumbnail(
  owner: string,
  repo: GitHubRepo,
): Promise<string> {
  const url = thumbnailUrl(owner, repo.name, repo.default_branch);
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) return url;
  } catch {
    /* use placeholder */
  }
  return PLACEHOLDER_THUMBNAIL;
}

function toErrorItem(
  repo: GitHubRepo,
  url: string,
  messages: string[],
): SodaListItem {
  const error: SodaProjectError = {
    repoName: repo.name,
    gitUrl: repo.html_url,
    metaUrl: url,
    messages,
  };
  return { kind: "error", error };
}

export async function fetchSodaProjects(): Promise<SodaListItem[]> {
  const owner = deriveOwner();
  const reposRes = await fetch(
    `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated`,
    { headers: githubApiHeaders() },
  );

  if (!reposRes.ok) {
    throw new Error(`Failed to fetch repositories (${reposRes.status})`);
  }

  const repos = (await reposRes.json()) as GitHubRepo[];
  const candidates = await Promise.all(
    repos.map(async (repo): Promise<SodaListItem | null> => {
      const result = await fetchMeta(owner, repo);

      // No .soda/meta.json → not a soda project.
      if (result.status === "missing") return null;

      if (result.status === "error") {
        return toErrorItem(repo, result.url, result.messages);
      }

      if (!result.meta.visible) return null;

      const thumb = await resolveThumbnail(owner, repo);
      const project = {
        repoName: repo.name,
        title: result.meta.title,
        description: result.meta.description,
        category: result.meta.category,
        status: result.meta.status,
        stars: repo.stargazers_count,
        gitUrl: repo.html_url,
        demoUrl: demoUrl(owner, repo.name),
        thumbnailUrl: thumb,
      } satisfies SodaProject;

      return { kind: "project", project };
    }),
  );

  return candidates
    .filter((item): item is SodaListItem => item !== null)
    .sort((a, b) => {
      const nameA = a.kind === "project" ? a.project.title : a.error.repoName;
      const nameB = b.kind === "project" ? b.project.title : b.error.repoName;
      return nameA.localeCompare(nameB, "ja");
    });
}

export { deriveOwner } from "./urls";
