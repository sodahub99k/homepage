import { For, Show } from "solid-js";
import { type ProjectWithLinks } from "../lib/fetchProjects";

export default function ProjectCard(props: ProjectWithLinks) {
  return (
    <article >
      <div aria-hidden >
        <div />
      </div>

      <div >
        <img

          src={props.url_thumbnail}
          alt={`${props.title} thumbnail`}
          loading="lazy"
        />
        <div />
      </div>

      <div >
        <div >
          <h3 >
            {props.title}
          </h3>
          <span >
            WORK
          </span>
        </div>

        <p >
          {props.description}
        </p>

        <Show when={(props.tags?.length ?? 0) > 0}>
          <div >
            <For each={(props.tags ?? []).slice(0, 6)}>
              {(tag: string) => (
                <span >
                  #{tag}
                </span>
              )}
            </For>
          </div>
        </Show>

        <div >
          <Show when={props.date}>
            <span >{props.date}</span>
          </Show>
          <div >
            <a

              href={props.url_demo}
              target="_blank"
              rel="noreferrer"
            >
              Demo →
            </a>
            <a

              href={props.url_git}
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
