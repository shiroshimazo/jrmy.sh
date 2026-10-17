import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import ThemeToggle from "./ThemeToggle";
import { useClickSound } from "../hooks/useClickSound";
import { scrollToSection } from "../utils/scrollToSection";
import "./Navbar.css";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

// Every destination fits in the dock at phone widths, so there is no drawer
// and no hamburger. Four links plus the toggle is the whole navigation.
export default function Navbar() {
  const [active, setActive] = useState("home");
  const play = useClickSound();
  const lenis = useLenis();

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
    play("tap");
    scrollToSection(id, lenis);
  };

  return (
    <nav className="nav" aria-label="Primary">
      <ul className="nav__list">
        {links.map((l) => (
          <li key={l.id}>
            <a
              href={`#${l.id}`}
              className={`nav__link label ${active === l.id ? "is-active" : ""}`}
              aria-current={active === l.id ? "true" : undefined}
              onClick={(e) => handleNav(e, l.id)}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <span className="nav__divider" aria-hidden="true" />

      <ThemeToggle />
    </nav>
  );
}