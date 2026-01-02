import { createMemo, createResource, For, onCleanup, onMount, Show } from "solid-js";
import { fetchProjects } from "./lib/fetchProjects";
import ProjectCard from "./components/ProjectCard";

function SectionTitle(props: { id?: string; title: string; subtitle?: string }) {
  return (
    <header >
      <h2
        id={props.id}

      >
        {props.title}
      </h2>
      <Show when={props.subtitle}>
        <p >
          {props.subtitle}
        </p>
      </Show>
    </header>
  );
}

function Pill(props: { children: any }) {
  return (
    <span >
      {props.children}
    </span>
  );
}

function ButtonLink(props: { href: string; children: string; variant?: "primary" | "ghost" }) {
  const isPrimary = () => props.variant !== "ghost";
  return (
    <a
      href={props.href}

    >
      {props.children}
      <span aria-hidden >
        →
      </span>
    </a>
  );
}

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

    >
      {/* Fluid background layers (CSS/JS only via CSS variables) */}
      <div aria-hidden />
      <div aria-hidden />
      <div aria-hidden />

      <header >
        <div >
          <a href="#top" >
            sodahub99k | HOME
          </a>
          <nav >
            <a href="#projects">
              Projects
            </a>
            <a href="#about">
              About
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section >
          <div >
            <div>
              <h1 >
                sodahub99k
              </h1>
              <p >
                engineering student / B3
              </p>

              <div >
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
        <section >
          <SectionTitle
            id="projects"
            title="Projects"
          // subtitle="GitHub の repo から project.json を見つけたものだけ表示します（サムネは thumbnail.png）。"
          />

          <div >
            <Show
              when={projects.state !== "pending"}
              fallback={
                <div >
                  <For each={Array.from({ length: 6 })}>
                    {() => (
                      <div />
                    )}
                  </For>
                </div>
              }
            >
              <Show
                when={(projects() ?? []).length > 0}
                fallback={
                  <div >
                    <p >表示できる作品がまだありません。</p>
                  </div>
                }
              >
                <div >
                  <For each={sortedProjects()}>
                    {(project) => <ProjectCard {...project} />}
                  </For>
                </div>
              </Show>
            </Show>
          </div>
        </section>

        {/* ABOUT */}
        <section >
          <SectionTitle
            id="about"
            title="About"
          // subtitle="作ったものを並べるだけじゃなく、何に惹かれているかも残す場所。"
          />
          <div >
            <div >
              <h3 >Hello</h3>
              <p >
                作品は「完成品」より「変化している途中」が好きです。
                触ると反応する UI、少しだけ無駄がある遊び、古い端末っぽい質感など。
              </p>
              <p >
                ここはトップページなので、あとで文章や写真、展示情報などに差し替えやすい構造にしています。
              </p>
            </div>
            <div >
              <h3 >Now</h3>
              <ul >
                <li >
                  <span >▸</span>
                  <span>小さいプロトタイプを速く作る</span>
                </li>
                <li >
                  <span >▸</span>
                  <span>レトロUIと現代的な触感の合体</span>
                </li>
                <li >
                  <span >▸</span>
                  <span>文章とコードのあいだの表現</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer >
        <div >
          <p >© {new Date().getFullYear()} sodahub99k</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
