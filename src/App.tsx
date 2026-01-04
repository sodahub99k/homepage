import { createMemo, createResource, For, onCleanup, onMount, Show } from "solid-js";
import { fetchProjects } from "./lib/fetchProjects";
import ProjectCard from "./components/ProjectCard";

import SectionTitle from "./components/SectionTitle";
import ButtonLink from "./components/ButtonLink";

const App = () => {
  const [projects] = createResource(fetchProjects);
  const username = () => import.meta.env.VITE_GITHUB_USERNAME as string | undefined;
  let rootRef: HTMLDivElement | undefined;

  onMount(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const apply = (x: number, y: number) => {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      const cx = Math.max(0, Math.min(w, x));
      const cy = Math.max(0, Math.min(h, y));

      const dx = (cx - w / 2) / w;
      const dy = (cy - h / 2) / h;

      rootRef?.style.setProperty("--mx", `${cx}px`);
      rootRef?.style.setProperty("--my", `${cy}px`);
      rootRef?.style.setProperty("--dx", `${Math.round(dx * 28)}px`);
      rootRef?.style.setProperty("--dy", `${Math.round(dy * 28)}px`);
    };

    // Initial center
    apply(window.innerWidth / 2, window.innerHeight / 2);
    if (prefersReduced) return;

    let raf = 0;
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        apply(lastX, lastY);
      });
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      schedule();
    };

    const onResize = () => {
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    onCleanup(() => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    });
  });
  const sortedProjects = createMemo(() => {
    const list = projects() ?? [];
    return [...list].sort((a, b) => {
      const da = a.date ? Date.parse(a.date) : 0;
      const db = b.date ? Date.parse(b.date) : 0;
      return db - da;
    });
  });

  return (
    <div
      ref={rootRef}
      class="page"
    >
      {/* Fluid background layers (CSS/JS only via CSS variables) */}
      <div aria-hidden class="bg-layer bg-layer--grid" />
      <div aria-hidden class="bg-layer bg-layer--spot" />
      <div aria-hidden class="bg-layer bg-layer--fade" />

      <header class="topbar">
        <div class="topbar__inner">
          <a href="#top" class="brand">
            sodahub99k | HOME
          </a>
          <nav class="nav">
            <a href="#projects">
              Projects
            </a>
          </nav>
        </div>
      </header>

      <main id="top" class="main">
        {/* HERO */}
        <section class="section hero">
          <div class="hero__grid">
            <div class="hero__lead">
              <h1 class="hero__title">
                sodahub99k
              </h1>
              <p class="hero__subtitle">
                engineering student / B3
              </p>

              <div class="cta">
                {/* <ButtonLink href="#projects" variant="primary">
                  作品を見る
                </ButtonLink> */}
                <Show when={username()} keyed>
                  {(u) => (
                    <ButtonLink href={`https://github.com/${u}`} variant="ghost">
                      GitHub
                    </ButtonLink>
                  )}
                </Show>
              </div>
            </div>

            {/* Right panel */}
            {/* <div >
              <div >
                <p >STATUS</p>
                <span >
                  <span  />
                  online
                </span>
              </div>
              <dl >
                <div >
                  <dt >stack</dt>
                  <dd >Solid + Tailwind</dd>
                </div>
                <div >
                  <dt >source</dt>
                  <dd >GitHub repos</dd>
                </div>
                <div >
                  <dt >updated</dt>
                  <dd >2026-01-01</dd>
                </div>
                <div >
                  <dt >mood</dt>
                  <dd >retro-future</dd>
                </div>
              </dl>
              <div >
                <p >
                  ここは自由枠。あとで「今やってること」「展示」「文章」などに差し替え可能です。
                </p>
              </div>
            </div> */}
          </div>
        </section>

        {/* PROJECTS */}
        <section class="section">
          <SectionTitle
            id="projects"
            title="Projects"
          // subtitle="GitHub の repo から project.json を見つけたものだけ表示します（サムネは thumbnail.png）。"
          />

          <div class="projects-wrap">
            <Show
              when={projects.state !== "pending"}
              fallback={
                <div class="skeleton-grid">
                  <For each={Array.from({ length: 6 })}>
                    {() => (
                      <div class="skeleton-card" />
                    )}
                  </For>
                </div>
              }
            >
              <Show
                when={(projects() ?? []).length > 0}
                fallback={
                  <div class="empty">
                    <p>表示できる作品がまだありません。</p>
                  </div>
                }
              >
                <div class="projects-grid">
                  <For each={sortedProjects()}>
                    {(project) => <ProjectCard {...project} />}
                  </For>
                </div>
              </Show>
            </Show>
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="footer__inner">
          <p>© {new Date().getFullYear()} sodahub99k</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
