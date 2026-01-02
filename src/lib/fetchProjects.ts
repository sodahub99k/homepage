export type Project = {
  title: string;
  description: string;
  tags: string[];
  date: string;
};

export type ProjectWithLinks = Project & {
  url_demo: string;
  url_git: string;
  url_thumbnail: string;
};


export async function fetchProjects(): Promise<ProjectWithLinks[]> {
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
        const url_git = repo.html_url;
        const url_demo = `https://${username}.github.io/${repo.name}/`;
        const url_thumbnail = `https://raw.githubusercontent.com/${username}/${repo.name}/main/thumbnail.png`;
        console.log(url_thumbnail);
        https://raw.githubusercontent.com/sodahub99k/LetterBoxedJP/main/thumbnail.png
        return {
          ...meta,
          url_demo,
          url_git,
          url_thumbnail,
        } satisfies ProjectWithLinks;
      } catch {
        return null;
      }
    })
  );

  return projects.filter(Boolean);
}
