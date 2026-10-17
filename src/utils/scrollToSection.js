const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
// 0, not the old -72: the nav floats at the bottom, so a section aligned to
// the top of the viewport is already clear of it. A negative offset would push
// every section down under nothing.
const SECTION_OFFSET = 0;
// Matches the Lenis root in SmoothScroll.jsx — two different lerps would mean
// nav clicks land at a different speed than the wheel. Same value, same
// damping-per-second curve at any refresh rate (see LENIS_OPTIONS there).
const SCROLL_LERP = 0.075;

export function scrollToSection(id, lenis) {
  const target = document.getElementById(id);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  if (lenis && !prefersReducedMotion) {
    lenis.scrollTo(target, {
      offset: SECTION_OFFSET,
      lerp: SCROLL_LERP,
    });
    return;
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}
