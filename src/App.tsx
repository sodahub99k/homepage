import { Hero } from "./components/Hero";
import { MetaErrorCard } from "./components/MetaErrorCard";
import { ProjectCard } from "./components/ProjectCard";
import { useSodaProjects } from "./hooks/useSodaProjects";
import "./App.css";

export default function App() {
  const state = useSodaProjects();

  return (
    <div className="app">
      <Hero />

      {state.status === "loading" && (
        <p className="state-message">Loading projects…</p>
      )}

      {state.status === "error" && (
        <p className="state-message state-error">{state.message}</p>
      )}

      {state.status === "empty" && (
        <p className="state-message">
          No visible soda projects found. Publish a project with{" "}
          <code>visible: true</code> in <code>.soda/meta.json</code>.
        </p>
      )}

      {state.status === "success" && (
        <section className="grid" aria-label="Projects">
          {state.items.map((item) =>
            item.kind === "project" ? (
              <ProjectCard
                key={item.project.repoName}
                project={item.project}
              />
            ) : (
              <MetaErrorCard
                key={`error-${item.error.repoName}`}
                error={item.error}
              />
            ),
          )}
        </section>
      )}
    </div>
  );
}
