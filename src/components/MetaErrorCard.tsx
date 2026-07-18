import type { SodaProjectError } from "../types";

interface MetaErrorCardProps {
  error: SodaProjectError;
}

export function MetaErrorCard({ error }: MetaErrorCardProps) {
  return (
    <article className="card card-error" aria-label={`Error: ${error.repoName}`}>
      <div className="card-body">
        <div className="card-header">
          <h2 className="card-title">{error.repoName}</h2>
          <span className="badge badge-error">meta error</span>
        </div>
        <p className="card-desc">
          Invalid or unreadable <code>.soda/meta.json</code>
        </p>
        <ul className="error-list">
          {error.messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
        <div className="card-links">
          <a href={error.metaUrl} target="_blank" rel="noopener noreferrer">
            meta.json
          </a>
          <a href={error.gitUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}
