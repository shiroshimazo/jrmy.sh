import { useEffect, useState } from "react";
import "./Navbar.css";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleNav = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__row">
        <a
          href="#home"
          className="nav__brand"
          onClick={(e) => handleNav(e, "home")}
          aria-label="Home"
        >
          <span className="nav__brand-mark" aria-hidden="true" />
          <span className="label nav__brand-name">SHIRO / PORTFOLIO</span>
        </a>

        <nav aria-label="Primary" className="nav__menu">
          <ul className="nav__list">
            {links.map((l, i) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => handleNav(e, l.id)}
                  className={`nav__link label ${
                    active === l.id ? "is-active" : ""
                  }`}
                >
                  <span className="nav__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={`nav__toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls="nav-drawer"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        id="nav-drawer"
        className={`nav__drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <ul className="nav__drawer-list">
          {links.map((l, i) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => handleNav(e, l.id)}
                className="nav__drawer-link"
              >
                <span className="label nav__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display-sm">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
