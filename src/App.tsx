import { Hero } from "./components/Hero";
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
          {state.projects.map((project) => (
            <ProjectCard key={project.repoName} project={project} />
          ))}
        </section>
      )}
    </div>
  );
}
