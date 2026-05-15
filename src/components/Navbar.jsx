import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
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

  // Lock body scroll while drawer open + close on Escape.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleNav = (e, id) => {
    e.preventDefault();
    setOpen(false);
    // defer scroll until after drawer close paints
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      <header className={`nav ${scrolled || open ? "nav--scrolled" : ""}`}>
        <div className="container nav__row">
          <a
            href="#home"
            className="nav__brand"
            onClick={(e) => handleNav(e, "home")}
            aria-label="Home"
          >
            <span className="nav__brand-mark" aria-hidden="true" />
            <span className="label nav__brand-name">JEREMY / PORTFOLIO</span>
          </a>

          <div className="nav__cluster">
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

            <ThemeToggle />

            <button
              className={`nav__toggle ${open ? "is-open" : ""}`}
              aria-expanded={open}
              aria-controls="nav-drawer"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="nav__toggle-bar" />
              <span className="nav__toggle-bar" />
              <span className="nav__toggle-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer is rendered as a sibling so backdrop-filter on .nav
          does not create a containing block that traps position:fixed. */}
      <div
        id="nav-drawer"
        className={`drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!open}
      >
        <button
          type="button"
          className="drawer__scrim"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />

        <div className="drawer__panel">
          <div className="drawer__top">
            <span className="label">Menu — 04 / 04</span>
          </div>

          <ul className="drawer__list">
            {links.map((l, i) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => handleNav(e, l.id)}
                  className="drawer__link"
                  tabIndex={open ? 0 : -1}
                >
                  <span className="label drawer__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="drawer__label">{l.label}</span>
                  <span className="drawer__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="drawer__foot">
            <span className="label">v2026.01</span>
            <span className="label">© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </>
  );
}
