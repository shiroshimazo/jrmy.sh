import Button from "./Button";
import { profile } from "../data/content";
import "./Hero.css";

export default function Hero() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="section section--hero hero">
      <div className="container hero__grid">
        <aside className="hero__meta">
          <span className="label">A — Index</span>
          <span className="label hero__meta-line">
            01 / Home
            <br />
            02 / About
            <br />
            03 / Projects
            <br />
            04 / Contact
          </span>
        </aside>

        <div className="hero__body">
          <span className="label hero__eyebrow">
            ▍ {profile.role} — {profile.location}
          </span>

          <h1 className="display hero__display">
            {profile.name}
            <span className="hero__dot">.</span>
          </h1>

          <p className="body hero__tagline">{profile.tagline}</p>

          <div className="hero__cta">
            <Button
              as="a"
              href="#projects"
              variant="primary"
              onClick={(e) => handleScroll(e, "projects")}
            >
              View Projects
            </Button>
            <Button
              as="a"
              href="#contact"
              variant="ghost"
              onClick={(e) => handleScroll(e, "contact")}
            >
              Get in Touch
            </Button>
          </div>
        </div>

        <aside className="hero__side">
          <div className="hero__stat">
            <span className="label">Version</span>
            <span className="h2">v2026.01</span>
          </div>
          <div className="hero__stat">
            <span className="label">Status</span>
            <span className="h2">
              <span className="hero__pulse" aria-hidden="true" />
              Available
            </span>
          </div>
        </aside>
      </div>

      <div className="container hero__foot">
        <span className="label">↓ Scroll</span>
        <span className="label">{new Date().getUTCFullYear()} ©</span>
      </div>
    </section>
  );
}
