import type { SodaProject } from "../types";

interface ProjectCardProps {
  project: SodaProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="card">
      <a
        href={project.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="card-thumb-link"
      >
        <img
          src={project.thumbnailUrl}
          alt=""
          className="card-thumb"
          loading="lazy"
        />
      </a>
      <div className="card-body">
        <div className="card-header">
          <h2 className="card-title">
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          </h2>
          <span className={`badge badge-${project.status}`}>{project.status}</span>
        </div>
        <p className="card-desc">{project.description}</p>
        <div className="card-meta">
          <span className="category">{project.category}</span>
          <span className="stars">★ {project.stars}</span>
        </div>
        <div className="card-links">
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            Demo
          </a>
          <a href={project.gitUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}
