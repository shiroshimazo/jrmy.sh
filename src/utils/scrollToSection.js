const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FIXED_HEADER_OFFSET = -72;
const SCROLL_LERP = 0.075;

export function scrollToSection(id, lenis) {
  const target = document.getElementById(id);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  if (lenis && !prefersReducedMotion) {
    lenis.scrollTo(target, {
      offset: FIXED_HEADER_OFFSET,
      lerp: SCROLL_LERP,
    });
    return;
  }

  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}
