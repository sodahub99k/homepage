import { For, Show } from "solid-js";
import { type ProjectWithLinks } from "../lib/fetchProjects";
import ButtonLink from "./ButtonLink";


export default function ProjectCard(props: ProjectWithLinks) {
  const openDemo = () => {
    if (!props.url_demo) return;
    window.open(props.url_demo, "_blank", "noreferrer");
  };

  const onCardClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (target.closest("a, button")) return;
    openDemo();
  };

  const onCardKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    openDemo();
  };

  return (
    <article
      class="card card--clickable"
      role="link"
      tabIndex={0}
      aria-label={`${props.title} demo を開く`}
      onClick={onCardClick}
      onKeyDown={onCardKeyDown}
    >
      <div aria-hidden class="card__rail" />

      <div class="card__media">
        <img
          src={props.url_thumbnail}
          alt={`${props.title} thumbnail`}
          loading="lazy"
        />
      </div>

      <div class="card__body">
        <div class="card__head">
          <h3 class="card__title">
            {props.title}
          </h3>
        </div>

        <p class="card__desc">
          {props.description}
        </p>

        <Show when={(props.tags?.length ?? 0) > 0}>
          <div class="card__tags">
            <For each={(props.tags ?? []).slice(0, 6)}>
              {(tag: string) => (
                <span class="pill">#{tag}</span>
              )}
            </For>
          </div>
        </Show>

        <div class="card__foot">
          <Show when={props.date}>
            <span>{props.date}</span>
          </Show>
          <ButtonLink href={props.url_git} variant="ghost">
            GitHub
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
