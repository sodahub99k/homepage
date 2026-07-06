import { deriveOwner } from "../utils/urls";

export function Hero() {
  const owner = deriveOwner();
  const profileUrl = `https://github.com/${owner}`;

  return (
    <header className="hero">
      <p className="hero-label">soda projects</p>
      <h1 className="hero-title">
        <a href={profileUrl} target="_blank" rel="noopener noreferrer">
          @{owner}
        </a>
      </h1>
      <p className="hero-sub">
        GitHub 上の soda プロジェクト一覧 —{" "}
        <a href={profileUrl} target="_blank" rel="noopener noreferrer">
          github.com/{owner}
        </a>
      </p>
    </header>
  );
}
