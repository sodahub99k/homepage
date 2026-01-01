export type Project = {
  title: string;
  description: string;
  url: string;
  repo: string;
  tags?: string[];
  date?: string;
  thumbnail: string;
};

export async function fetchProjects(): Promise<Project[]> {
  const username = import.meta.env.VITE_GITHUB_USERNAME as string | undefined;
  if (!username) return [];

  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  const repos = await res.json();

  const projects = await Promise.all(
    repos.map(async (repo: any) => {
      try {
        const metaRes = await fetch(
          `https://raw.githubusercontent.com/${username}/${repo.name}/main/project.json`
        );
        if (!metaRes.ok) return null;

        const meta = await metaRes.json();

        const title = (meta?.title ?? repo.name) as string;
        const description = (meta?.description ?? repo.description ?? "") as string;
        const url = (meta?.url ?? repo.homepage ?? repo.html_url) as string;
        const repoUrl = (meta?.repo ?? repo.html_url) as string;
        const tags = Array.isArray(meta?.tags) ? (meta.tags as string[]) : undefined;
        const date = typeof meta?.date === "string" ? (meta.date as string) : undefined;

        return {
          title,
          description,
          url,
          repo: repoUrl,
          tags,
          date,
          thumbnail: `https://raw.githubusercontent.com/${username}/${repo.name}/main/thumbnail.png`,
        } satisfies Project;
      } catch {
        return null;
      }
    })
  );

  return projects.filter(Boolean);
}
