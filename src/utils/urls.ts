/**
 * Derive GitHub owner from hostname in production.
 * e.g. https://soda.github.io/homepage/ → "soda"
 * Local dev falls back to VITE_GITHUB_OWNER from .env
 */
export function deriveOwner(): string {
  const hostname = window.location.hostname;

  if (hostname.endsWith(".github.io")) {
    const owner = hostname.replace(/\.github\.io$/, "");
    if (owner) return owner;
  }

  const fallback = import.meta.env.VITE_GITHUB_OWNER;
  if (typeof fallback === "string" && fallback.trim()) {
    return fallback.trim();
  }

  throw new Error(
    "Could not derive GitHub owner. Set VITE_GITHUB_OWNER in .env for local dev.",
  );
}

export function demoUrl(owner: string, repoName: string): string {
  return `https://${owner}.github.io/${repoName}/`;
}

export function metaUrl(
  owner: string,
  repoName: string,
  branch: string,
): string {
  return `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/.soda/meta.json`;
}

export function thumbnailUrl(
  owner: string,
  repoName: string,
  branch: string,
): string {
  return `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/.soda/thumbnail.png`;
}

export const PLACEHOLDER_THUMBNAIL =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
      <rect fill="#1a1d27" width="400" height="225"/>
      <text x="200" y="118" fill="#5a6270" font-family="system-ui,sans-serif" font-size="16" text-anchor="middle">No thumbnail</text>
    </svg>`,
  );

export function githubApiHeaders(): HeadersInit {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (typeof token === "string" && token.trim()) {
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token.trim()}`,
    };
  }
  return { Accept: "application/vnd.github+json" };
}
