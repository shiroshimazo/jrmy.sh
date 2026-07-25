import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const LENIS_OPTIONS = {
  autoRaf: true,
  autoToggle: true,
  smoothWheel: true,
  lerp: 0.075,
  wheelMultiplier: 0.9,
  syncTouch: false,
  anchors: { offset: -72 },
  stopInertiaOnNavigate: true,
};

export default function SmoothScroll() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (event) => setReducedMotion(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (reducedMotion) return null;

  return <ReactLenis root options={LENIS_OPTIONS} />;
}
