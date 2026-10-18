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

// The intro overlay owns its own clock — greetings, the name, then the wipe —
// and reports back when the curtain has actually cleared. `loading` therefore
// tracks "is anything still covering the page", not "have the fonts arrived".
export default function App() {
  const [loading, setLoading] = useState(true);

  // Page-wide hover cues (GitHub activity graph excluded — see the hook).
  useHoverSound();

  // Held until the curtain lifts, not until the sequence ends: a wheel event
  // during the wipe would scroll the page out from under the animation.
  // `scrollbar-gutter: stable` on html keeps the layout from shifting when the
  // scrollbar goes away.
  useEffect(() => {
    if (!loading) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <InspectGuard />

      <AnimatePresence initial={false}>
        {loading && <Loader key="loader" onDone={() => setLoading(false)} />}
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
