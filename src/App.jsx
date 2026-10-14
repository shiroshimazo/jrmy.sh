import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import InspectGuard from "./components/InspectGuard";
import SmoothScroll from "./components/motion/SmoothScroll";
import { useHoverSound } from "./hooks/useHoverSound";
import "./App.css";

// Longest the overlay is allowed to stay up if something never settles.
// Above this the content is readable behind it and a stuck loader is worse
// than no loader at all.
const LOADER_CEILING = 1200;

export default function App() {
  const [loading, setLoading] = useState(true);

  // Page-wide hover cues (GitHub activity graph excluded — see the hook).
  useHoverSound();

  // Gate on what the loader is actually covering: webfonts. A fixed timer used
  // to hold an opaque full-screen overlay for 1800 ms on every load while the
  // entire page mounted, animated and fetched behind it.
  useEffect(() => {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      setLoading(false);
    };

    const fonts = document.fonts?.ready;
    if (fonts) fonts.then(settle).catch(settle);
    else settle();

    const ceiling = setTimeout(settle, LOADER_CEILING);
    return () => {
      settled = true;
      clearTimeout(ceiling);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <InspectGuard />

      <AnimatePresence initial={false}>
        {loading && <Loader key="loader" />}
      </AnimatePresence>

      <div className="app" aria-busy={loading}>
        {/* #main, not #home — #home is the hero, which is above everything the
            skip link is meant to bypass. */}
        <a className="visually-hidden" href="#main">
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
