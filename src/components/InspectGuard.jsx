import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { usePatch } from "@web-kits/audio/react";
import { EASE } from "./motion/motion-presets";
import { minimal } from "../../audio/index";
import "./InspectGuard.css";

// How long the warning stays up before it dismisses itself.
const LINGER = 2400;

// Devtools / view-source shortcuts. Browsers own most of these and will open
// their panel regardless of preventDefault — the warning is a speed bump for
// the curious, not a lock. Anything shipped to a browser is readable.
function isPeeking(e) {
  const key = (e.key ?? "").toLowerCase();
  const mod = e.ctrlKey || e.metaKey;
  if (key === "f12") return true;
  if (mod && e.shiftKey && (key === "i" || key === "j" || key === "c")) return true;
  if (mod && (key === "u" || key === "s")) return true;
  return false;
}

export default function InspectGuard() {
  const [caught, setCaught] = useState(false);
  // The patch itself is memoized, unlike the closure useClickSound returns,
  // so the listeners below bind once instead of on every render.
  const patch = usePatch(minimal._patch);

  useEffect(() => {
    const warn = () => {
      setCaught(true);
      patch.play("error");
    };

    const onKey = (e) => {
      if (!isPeeking(e)) return;
      e.preventDefault();
      warn();
    };

    const onContextMenu = (e) => {
      e.preventDefault();
      warn();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("contextmenu", onContextMenu);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, [patch]);

  // Each new trip restarts the countdown rather than stacking timers.
  useEffect(() => {
    if (!caught) return;
    const t = setTimeout(() => setCaught(false), LINGER);
    const onEscape = (e) => e.key === "Escape" && setCaught(false);
    window.addEventListener("keydown", onEscape);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onEscape);
    };
  }, [caught]);

  return createPortal(
    <AnimatePresence>
      {caught && (
        <motion.div
          className="guard"
          role="alertdialog"
          aria-label="Inspection blocked"
          onClick={() => setCaught(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE }}
        >
          <motion.div
            className="guard__panel"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            <span className="label guard__eyebrow">Access denied</span>
            <p className="h2 guard__msg">nuh-uh dont try</p>
            <span className="label guard__hint">Click anywhere to dismiss</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
