import { For, Show } from "solid-js";

type Props = {
  title: string;
  description: string;
  url: string;
  repo: string;
  thumbnail: string;
  tags?: string[];
  date?: string;
};

export default function ProjectCard(props: Props) {
  return (
    <article class="group relative overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-950/40 transition hover:-translate-y-0.5 hover:bg-zinc-950/60">
      <div aria-hidden class="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div class="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div class="relative aspect-16/10 overflow-hidden border-b border-zinc-800/70">
        <img
          class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          src={props.thumbnail}
          alt={`${props.title} thumbnail`}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/vite.svg";
          }}
        />
        <div class="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-950/70 via-transparent to-transparent" />
      </div>

      <div class="relative p-5">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-mono text-base font-semibold leading-snug tracking-tight text-zinc-100">
            {props.title}
          </h3>
          <span class="shrink-0 rounded-full border border-zinc-800/80 bg-zinc-950/30 px-2 py-1 font-mono text-[10px] font-semibold text-zinc-400">
            WORK
          </span>
        </div>

        <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {props.description}
        </p>

        <Show when={(props.tags?.length ?? 0) > 0}>
          <div class="mt-4 flex flex-wrap gap-2">
            <For each={(props.tags ?? []).slice(0, 6)}>
              {(tag: string) => (
                <span class="rounded-full border border-zinc-800/80 bg-zinc-950/30 px-2 py-1 text-[11px] font-medium text-zinc-300">
                  #{tag}
                </span>
              )}
            </For>
          </div>
        </Show>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Show when={props.date}>
            <span class="font-mono text-[11px] text-zinc-500">{props.date}</span>
          </Show>
          <div class="flex gap-2">
            <a
              class="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-300 active:translate-y-px"
              href={props.url}
              target="_blank"
              rel="noreferrer"
            >
              Demo →
            </a>
            <a
              class="rounded-xl border border-zinc-800/80 bg-zinc-950/30 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-zinc-900/60 active:translate-y-px"
              href={props.repo}
              target="_blank"
              rel="noreferrer"
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
