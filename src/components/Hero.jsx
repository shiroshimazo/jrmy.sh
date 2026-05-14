import Button from "./Button";
import { profile } from "../data/content";
import profileImg from "../assets/profile.jpg";
import "./Hero.css";

export default function Hero() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="section section--hero hero">
      <div className="container hero__grid">
        <figure className="hero__portrait">
          <img
            src={profileImg}
            alt={`Portrait of ${profile.name}`}
            loading="eager"
            decoding="async"
          />
          <figcaption className="label hero__portrait-cap">
            <span>Portrait</span>
            <span>— {new Date().getUTCFullYear()}</span>
          </figcaption>
        </figure>

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
      </div>
    </section>
  );
}
