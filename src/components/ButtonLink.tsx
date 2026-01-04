
const ButtonLink = (props: { href: string; children: string; variant?: "primary" | "ghost" }) => {
  const isPrimary = () => props.variant !== "ghost";
  return (
    <a
      href={props.href}
      classList={{
        btn: true,
        "btn--primary": isPrimary(),
        "btn--ghost": !isPrimary(),
      }}
    >
      {props.children}
      <span aria-hidden class="btn__arrow">
        →
      </span>
    </a>
  );
}

export default ButtonLink;