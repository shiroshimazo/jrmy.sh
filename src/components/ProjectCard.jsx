import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const { title, tag, year, description, stack, href, repo, upcoming } =
    project;

  return (
    <article className={`card ${upcoming ? "card--upcoming" : ""}`}>
      <div className="card__head">
        <span className="label">{tag}</span>
        <span className="label card__year">{year}</span>
      </div>

      <h3 className="h2 card__title">{title}</h3>
      <p className="body card__desc">{description}</p>

      <ul className="card__stack" aria-label="Stack">
        {stack.map((s) => (
          <li key={s} className="label card__chip">
            {s}
          </li>
        ))}
      </ul>

      <div className="card__actions">
        {upcoming && (
          <span
            className="card__link card__link--disabled"
            aria-disabled="true"
            title="Coming soon"
          >
            <span>Open</span>
            <span className="card__link-sub">(upcoming)</span>
          </span>
        )}

        {href && !upcoming && (
          <a
            className="card__link"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${title}`}
          >
            <span>Open</span>
            <Arrow />
          </a>
        )}

        {repo && (
          <a
            className={`card__link ${upcoming ? "" : "card__link--muted"}`}
            href={repo}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title} source`}
          >
            <span>Source</span>
            <Arrow />
          </a>
        )}
      </div>
    </article>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 11L11 3M11 3H4.5M11 3V9.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}
