import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { profile } from "../data/content";
import portrait240 from "../assets/profile-240.webp";
import { EASE } from "./motion/motion-presets";
import "./Loader.css";

/**
 * Intro curtain: greetings type through, the portrait says the name, then the
 * curtain lifts off the top of the page.
 *
 * Plays once per session (sessionStorage), never for reduced-motion visitors,
 * and is gated on webfonts so the copy never renders in the fallback face and
 * then reflows when the real one arrives.
 */
const STORAGE_KEY = "jrmy-intro-played";

const GREETINGS = ["Hello", "Bonjour", "Kumusta", "Hola", "Ciao", "Guten tag"];
const FIRST_NAME = profile.name.split(" ")[0];

// One greeting per GREETING_STEP, then HOLD on the name, then the wipe. The
// whole sequence is ~1.8s — long enough to read, short enough that a reload
// doesn't feel like the site is stalling.
const GREETING_STEP = 140;
const HOLD = 420;
const WIPE = { duration: 0.5, ease: [0.22, 1, 0.32, 1] };

// Ceiling on the font wait. Past this the overlay lifts on a fallback face
// rather than holding the page hostage — a missing font is a worse first
// impression than an unstyled word for 200ms.
const FONT_CEILING = 900;

export default function Loader({ onDone }) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState("idle"); // idle | greetings | identity | profile
  const [word, setWord] = useState(0);
  const onDoneRef = useRef(onDone);

  // Held in a ref so an inline callback from the parent doesn't re-run the
  // effects below and restart the sequence.
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Private mode / storage disabled — the intro just plays again next load.
    }
    onDoneRef.current();
  }, []);

  useEffect(() => {
    let played = false;
    try {
      played = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Unreadable storage: treat as never played.
    }

    if (reduceMotion || played) {
      onDoneRef.current();
      return;
    }

    let alive = true;
    const start = () => {
      if (alive) setStage("greetings");
    };

    const fonts = document.fonts?.ready;
    if (fonts) fonts.then(start).catch(start);
    else start();

    const ceiling = setTimeout(start, FONT_CEILING);
    return () => {
      alive = false;
      clearTimeout(ceiling);
    };
  }, [reduceMotion]);

  // Greetings: word 0 is already on screen, so the timers only advance from the
  // second one — starting the count at 1 leaves an empty stage for a beat.
  useEffect(() => {
    if (stage !== "greetings") return;
    const timers = GREETINGS.slice(1).map((_, i) =>
      setTimeout(() => setWord(i + 1), (i + 1) * GREETING_STEP)
    );
    timers.push(
      setTimeout(() => setStage("identity"), GREETINGS.length * GREETING_STEP)
    );
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  // Hold on the name long enough to read it, then lift the curtain.
  useEffect(() => {
    if (stage !== "identity") return;
    const timer = setTimeout(() => setStage("profile"), HOLD);
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <div className="loader" role="status" aria-label="Loading portfolio">
      <AnimatePresence onExitComplete={finish}>
        {stage !== "profile" && (
          <motion.div
            key="curtain"
            className="loader__curtain"
            aria-hidden="true"
            initial={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={WIPE}
          />
        )}
      </AnimatePresence>

      <div className="loader__stage" aria-hidden="true">
        <AnimatePresence mode="wait">
          {stage === "greetings" && (
            <motion.p
              key="greetings"
              className="loader__line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
            >
              <span className="loader__dot" />
              <span className="loader__word">
                {/* mode="wait": the outgoing word leaves before the next one
                    arrives, so the two never overlap and each greeting is
                    centred on its own rather than crossfading in place. */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    /* Transform + opacity only. A blur() crossfade looks richer
                       but re-rasterizes the text every frame, and at a 140ms
                       word step that is 5 re-rasters per greeting the reader
                       never gets to finish. */
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    {GREETINGS[word]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.p>
          )}

          {stage === "identity" && (
            <motion.p
              key="identity"
              className="loader__line"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <span className="loader__pronoun">I&rsquo;m</span>
              <span className="loader__avatar">
                <img src={portrait240} alt="" width={48} height={48} decoding="async" />
              </span>
              <span className="loader__name">{FIRST_NAME}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}