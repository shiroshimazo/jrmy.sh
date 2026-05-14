import { profile } from "../data/content";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__row">
        <div className="footer__col">
          <span className="label">Index</span>
          <span className="h2 footer__brand">{profile.name}.</span>
        </div>

        <div className="footer__col">
          <span className="label">Sections</span>
          <ul className="footer__list">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <span className="label">Elsewhere</span>
          <ul className="footer__list">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col footer__col--end">
          <span className="label">Meta</span>
          <span className="body footer__meta">© {year} {profile.name}</span>
          <span className="body footer__meta">All rights reserved</span>
        </div>
      </div>

      <div className="container footer__bar">
        <span className="label">v2026.01 — Built with React + Vite</span>
        <a href="#home" className="label footer__top">
          ↑ Top
        </a>
      </div>
    </footer>
  );
}
