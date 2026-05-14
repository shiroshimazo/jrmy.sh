import "./SectionTitle.css";

export default function SectionTitle({ index, label, title, lead }) {
  return (
    <header className="sect-title">
      <div className="sect-title__meta">
        {index && <span className="label sect-title__index">{index}</span>}
        {label && <span className="label sect-title__label">{label}</span>}
      </div>
      <h2 className="h1 sect-title__heading">{title}</h2>
      {lead && <p className="body sect-title__lead">{lead}</p>}
    </header>
  );
}
