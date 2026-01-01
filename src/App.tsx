import { createMemo, createResource, For, onCleanup, onMount, Show } from "solid-js";
import { fetchProjects } from "./lib/fetchProjects";
import ProjectCard from "./components/ProjectCard";

function SectionTitle(props: { id?: string; title: string; subtitle?: string }) {
  return (
    <header class="mx-auto mb-6 max-w-6xl px-4 sm:px-6 lg:px-8">
      <h2
        id={props.id}
        class="scroll-mt-24 font-mono text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl"
      >
        {props.title}
      </h2>
      <Show when={props.subtitle}>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          {props.subtitle}
        </p>
      </Show>
    </header>
  );
}

function Pill(props: { children: any }) {
  return (
    <span class="inline-flex items-center rounded-full border border-zinc-800/80 bg-zinc-950/40 px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-300">
      {props.children}
    </span>
  );
}

function ButtonLink(props: { href: string; children: string; variant?: "primary" | "ghost" }) {
  const isPrimary = () => props.variant !== "ghost";
  return (
    <a
      href={props.href}
      class={
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition" +
        (isPrimary()
          ? " bg-emerald-400 text-zinc-950 shadow-sm hover:bg-emerald-300 active:translate-y-px"
          : " border border-zinc-800/80 bg-zinc-950/40 text-zinc-100 hover:bg-zinc-900/60 active:translate-y-px")
      }
    >
      {props.children}
      <span aria-hidden class="text-xs opacity-70">
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
      class="min-h-dvh bg-zinc-950 text-zinc-100 selection:bg-emerald-300 selection:text-zinc-950"
    >
      {/* Fluid background layers (CSS/JS only via CSS variables) */}
      <div aria-hidden class="bg-grid-overlay pointer-events-none fixed inset-0 -z-10" />
      <div aria-hidden class="bg-spotlight pointer-events-none fixed inset-0 -z-10" />
      <div aria-hidden class="bg-scanlines pointer-events-none fixed inset-0 -z-10" />

      <header class="sticky top-0 z-20 border-b border-zinc-800/70 bg-zinc-950/70 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" class="font-mono text-sm font-semibold tracking-wide text-zinc-100">
            SODA / WORKS
          </a>
          <nav class="flex items-center gap-2 text-xs text-zinc-300 sm:gap-3">
            <a class="rounded-lg px-2 py-1 hover:bg-zinc-900/60" href="#projects">
              Projects
            </a>
            <a class="rounded-lg px-2 py-1 hover:bg-zinc-900/60" href="#about">
              About
            </a>
            <a class="rounded-lg px-2 py-1 hover:bg-zinc-900/60" href="#contact">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section class="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div class="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <Pill>retro</Pill>
                <Pill>creative</Pill>
                <Pill>fluid</Pill>
                <Show when={username()} keyed>
                  {(u) => <Pill>@{u}</Pill>}
                </Show>
              </div>

              <h1 class="mt-5 font-mono text-4xl font-bold leading-tight tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
                作品を並べて、
                <span class="text-emerald-300">遊ぶ</span>
                ためのホームページ
              </h1>
              <p class="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                GitHub から作品メタデータを fetch して一覧表示します。レトロな雰囲気をベースに、
                触って気持ちいい最小限のマイクロインタラクションを入れています。
              </p>

              <div class="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="#projects" variant="primary">
                  作品を見る
                </ButtonLink>
                <Show when={username()} keyed>
                  {(u) => (
                    <ButtonLink href={`https://github.com/${u}`} variant="ghost">
                      GitHub
                    </ButtonLink>
                  )}
                </Show>
              </div>

              <div class="mt-8 rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4">
                <p class="font-mono text-xs text-zinc-400">
                  tip: `project.json` と `thumbnail.png` がある repo がここに出ます
                </p>
              </div>
            </div>

            {/* Right panel */}
            <div class="rounded-3xl border border-zinc-800/70 bg-zinc-950/40 p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <p class="font-mono text-xs font-semibold tracking-wide text-zinc-300">STATUS</p>
                <span class="inline-flex items-center gap-2 text-xs text-zinc-400">
                  <span class="h-2 w-2 rounded-full bg-emerald-400" />
                  online
                </span>
              </div>
              <dl class="mt-4 grid grid-cols-2 gap-3">
                <div class="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3">
                  <dt class="font-mono text-[11px] text-zinc-400">stack</dt>
                  <dd class="mt-1 text-sm font-semibold text-zinc-100">Solid + Tailwind</dd>
                </div>
                <div class="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3">
                  <dt class="font-mono text-[11px] text-zinc-400">source</dt>
                  <dd class="mt-1 text-sm font-semibold text-zinc-100">GitHub repos</dd>
                </div>
                <div class="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3">
                  <dt class="font-mono text-[11px] text-zinc-400">updated</dt>
                  <dd class="mt-1 text-sm font-semibold text-zinc-100">2026-01-01</dd>
                </div>
                <div class="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3">
                  <dt class="font-mono text-[11px] text-zinc-400">mood</dt>
                  <dd class="mt-1 text-sm font-semibold text-zinc-100">retro-future</dd>
                </div>
              </dl>
              <div class="mt-4 rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-3">
                <p class="text-xs leading-relaxed text-zinc-400">
                  ここは自由枠。あとで「今やってること」「展示」「文章」などに差し替え可能です。
                </p>
              </div>
            </div>
          </div>

          {/* Marquee */}
          <div class="mt-10 overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-950/40">
            <div class="marquee flex gap-8 py-3 text-xs font-semibold tracking-wide text-zinc-300">
              <span class="px-4">SOLID</span>
              <span>•</span>
              <span>TAILWIND</span>
              <span>•</span>
              <span>RETRO UI</span>
              <span>•</span>
              <span>MICRO INTERACTIONS</span>
              <span>•</span>
              <span>WORKS</span>
              <span>•</span>
              <span>PLAY</span>
              <span>•</span>
              <span>SOLID</span>
              <span>•</span>
              <span>TAILWIND</span>
              <span>•</span>
              <span>RETRO UI</span>
              <span>•</span>
              <span>MICRO INTERACTIONS</span>
              <span>•</span>
              <span>WORKS</span>
              <span>•</span>
              <span>PLAY</span>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section class="mt-14 pb-6 sm:mt-16">
          <SectionTitle
            id="projects"
            title="Projects"
            subtitle="GitHub の repo から project.json を見つけたものだけ表示します（サムネは thumbnail.png）。"
          />

          <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Show
              when={projects.state !== "pending"}
              fallback={
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <For each={Array.from({ length: 6 })}>
                    {() => (
                      <div class="h-72 animate-pulse rounded-3xl border border-zinc-800/70 bg-zinc-950/40" />
                    )}
                  </For>
                </div>
              }
            >
              <Show
                when={(projects() ?? []).length > 0}
                fallback={
                  <div class="rounded-3xl border border-zinc-800/70 bg-zinc-950/40 p-6">
                    <p class="text-sm text-zinc-300">表示できる作品がまだありません。</p>
                    <p class="mt-2 text-xs leading-relaxed text-zinc-400">
                      対象 repo の `main` ブランチ直下に `project.json` を置くと出ます。
                      例: title/description/url/repo/thumbnail など。
                    </p>
                  </div>
                }
              >
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <For each={sortedProjects()}>
                    {(project) => <ProjectCard {...project} />}
                  </For>
                </div>
              </Show>
            </Show>
          </div>
        </section>

        {/* ABOUT */}
        <section class="mt-14 pb-6 sm:mt-16">
          <SectionTitle
            id="about"
            title="About"
            subtitle="作ったものを並べるだけじゃなく、何に惹かれているかも残す場所。"
          />
          <div class="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div class="rounded-3xl border border-zinc-800/70 bg-zinc-950/40 p-6">
              <h3 class="font-mono text-sm font-semibold text-zinc-100">Hello</h3>
              <p class="mt-3 text-sm leading-relaxed text-zinc-400">
                作品は「完成品」より「変化している途中」が好きです。
                触ると反応する UI、少しだけ無駄がある遊び、古い端末っぽい質感など。
              </p>
              <p class="mt-3 text-sm leading-relaxed text-zinc-400">
                ここはトップページなので、あとで文章や写真、展示情報などに差し替えやすい構造にしています。
              </p>
            </div>
            <div class="rounded-3xl border border-zinc-800/70 bg-zinc-950/40 p-6">
              <h3 class="font-mono text-sm font-semibold text-zinc-100">Now</h3>
              <ul class="mt-3 space-y-2 text-sm text-zinc-400">
                <li class="flex gap-2">
                  <span class="text-emerald-300">▸</span>
                  <span>小さいプロトタイプを速く作る</span>
                </li>
                <li class="flex gap-2">
                  <span class="text-emerald-300">▸</span>
                  <span>レトロUIと現代的な触感の合体</span>
                </li>
                <li class="flex gap-2">
                  <span class="text-emerald-300">▸</span>
                  <span>文章とコードのあいだの表現</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section class="mt-14 pb-16 sm:mt-16">
          <SectionTitle id="contact" title="Contact" subtitle="気軽にどうぞ。リンクは増やしてもOK。" />
          <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div class="rounded-3xl border border-zinc-800/70 bg-zinc-950/40 p-6">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="text-sm text-zinc-300">SNS / 連絡先</p>
                <div class="flex flex-wrap gap-2">
                  <Show when={username()} keyed>
                    {(u) => (
                      <a
                        class="rounded-xl border border-zinc-800/80 bg-zinc-950/30 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-900/60"
                        href={`https://github.com/${u}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                  </Show>
                  <a
                    class="rounded-xl border border-zinc-800/80 bg-zinc-950/30 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-900/60"
                    href="#projects"
                  >
                    Projects
                  </a>
                </div>
              </div>
              <p class="mt-3 text-xs leading-relaxed text-zinc-400">
                ここはあとで Twitter / Blog / Email などに差し替えできます。まずは最小の導線だけ置いてあります。
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer class="border-t border-zinc-800/70 bg-zinc-950/60">
        <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p class="font-mono">© {new Date().getFullYear()} soda</p>
          <p class="font-mono">built with solid + tailwind</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
