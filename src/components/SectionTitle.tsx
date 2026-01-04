import { Show } from "solid-js";

const SectionTitle = (props: { id?: string; title: string; subtitle?: string }) => {
  return (
    <header class="section-title">
      <h2
        id={props.id}
        class="scroll-mt-24"
      >
        {props.title}
      </h2>
      <Show when={props.subtitle}>
        <p>
          {props.subtitle}
        </p>
      </Show>
    </header>
  );
}

export default SectionTitle;
