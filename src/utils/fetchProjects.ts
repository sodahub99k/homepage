import type { GitHubRepo, SodaMeta, SodaProject } from "../types";
import {
  demoUrl,
  deriveOwner,
  githubApiHeaders,
  metaUrl,
  PLACEHOLDER_THUMBNAIL,
  thumbnailUrl,
} from "./urls";

async function fetchMeta(
  owner: string,
  repo: GitHubRepo,
): Promise<SodaMeta | null> {
  const url = metaUrl(owner, repo.name, repo.default_branch);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as SodaMeta;
  } catch {
    return null;
  }
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

export async function fetchSodaProjects(): Promise<SodaProject[]> {
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
    repos.map(async (repo) => {
      const meta = await fetchMeta(owner, repo);
      if (!meta?.visible) return null;

      const thumb = await resolveThumbnail(owner, repo);
      return {
        repoName: repo.name,
        title: meta.title,
        description: meta.description,
        category: meta.category,
        status: meta.status,
        stars: repo.stargazers_count,
        gitUrl: repo.html_url,
        demoUrl: demoUrl(owner, repo.name),
        thumbnailUrl: thumb,
      } satisfies SodaProject;
    }),
  );

  return candidates
    .filter((p): p is SodaProject => p !== null)
    .sort((a, b) => a.title.localeCompare(b.title, "ja"));
}

export { deriveOwner } from "./urls";
