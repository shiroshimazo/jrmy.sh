import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Lenis drives touch through its own inertia model when syncTouch is on, and
// its own docs call that unstable before iOS 16 — the emulated drag can fight
// the native gesture and the page ends up hard to scroll. Older iOS keeps the
// platform's own momentum, which is better than a broken one.
function supportsStableSyncTouch() {
  const ua = navigator.userAgent;

  // iPadOS 13+ reports itself as a Mac. The touch-point count is what gives it
  // away, and every iPad that does is far past iOS 16, so it skips the gate.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true;
  if (!/iP(hone|ad|od)/.test(ua)) return true;

  const version = ua.match(/OS (\d+)[_.]/)?.[1];
  return version ? Number(version) >= 16 : false;
}

const LENIS_OPTIONS = {
  autoRaf: true,
  autoToggle: true,
  smoothWheel: true,
  // Lenis advances with damp(value, to, lerp * 60, deltaTime) — damping in
  // seconds, not per frame. One lerp value gives the same wall-clock glide at
  // 60Hz and at 120Hz, so there is no refresh-rate compensation to apply. The
  // 0.04 that used to sit here was halving the glide on every device to "fix"
  // a 120Hz panel that was never in fact tracking twice as fast.
  lerp: 0.075,
  wheelMultiplier: 0.9,
  // Touch: Lenis takes over the gesture instead of handing it to the platform.
  // While the finger is down it animates with lerp 1, so the drag tracks 1:1
  // and adds no lag; syncTouchLerp governs only the fling after release, which
  // is where native momentum is replaced by Lenis's.
  syncTouch: true,
  syncTouchLerp: 0.075,
  anchors: { offset: 0 },
  stopInertiaOnNavigate: true,
};

export default function SmoothScroll() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
  // Decided once — the platform does not change mid-session.
  const [syncTouch] = useState(supportsStableSyncTouch);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (event) => setReducedMotion(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (reducedMotion) return null;

  return <ReactLenis root options={{ ...LENIS_OPTIONS, syncTouch }} />;
}