import { useEffect } from "react";
import { usePatch } from "@web-kits/audio/react";
import { minimal } from "../../audio/index";

// One delegated listener instead of onMouseEnter on every control:
// anything that visibly reacts to the cursor gets an audible cue too.
const CUE = 'a[href], button, [role="button"], .hero__portrait';

// Muted zones. The contribution grid is 371 hoverable cells inside a single
// link — a cue per cell would be a machine gun. The drawer scrim is an
// invisible full-screen button that slides under a resting cursor.
const MUTED = '.ghc, .drawer__scrim, [aria-disabled="true"], :disabled';

// A cue needs recent pointer travel behind it: scrolling slides elements under
// a still cursor and fires pointerover without the user aiming at anything.
const MOVE_WINDOW = 120;
// Floor between cues so a fast sweep across the nav doesn't stack into a buzz.
const MIN_GAP = 45;

export function useHoverSound() {
  const patch = usePatch(minimal._patch);

  useEffect(() => {
    // Touch and pen have no hover state to sonify.
    if (!window.matchMedia?.("(hover: hover)").matches) return;

    let entered = null;
    let movedAt = 0;
    let playedAt = 0;

    const onMove = (e) => {
      if (e.pointerType === "mouse") movedAt = e.timeStamp;
    };

    const onOver = (e) => {
      if (e.pointerType !== "mouse") return;
      const el = e.target.closest(CUE);
      // Crossing between children of the same control is not a new hover.
      if (el === entered) return;
      entered = el;
      if (!el || el.closest(MUTED)) return;
      if (e.timeStamp - movedAt > MOVE_WINDOW) return;
      if (e.timeStamp - playedAt < MIN_GAP) return;
      playedAt = e.timeStamp;
      // Slight detune per cue keeps a run down the nav from sounding stamped.
      patch.play("hover", { detune: (Math.random() - 0.5) * 40 });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  }, [patch]);
}
