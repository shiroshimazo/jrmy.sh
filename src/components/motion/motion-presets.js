// Smooth, design-system-friendly easing.
export const EASE = [0.2, 0.65, 0.3, 0.9];

export const VIEWPORT = { once: false, margin: "-12% 0px -12% 0px" };
export const VIEWPORT_TIGHT = { once: false, margin: "-6% 0px -6% 0px" };

export const fadeUp = (delay = 0, y = 24, duration = 0.7) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  exit: { opacity: 0, y },
  transition: { duration, delay, ease: EASE },
  viewport: VIEWPORT,
});

export const fadeRight = (delay = 0, x = 28, duration = 0.7) => ({
  initial: { opacity: 0, x: -x },
  whileInView: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -x },
  transition: { duration, delay, ease: EASE },
  viewport: VIEWPORT,
});

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

export const staggerItem = (y = 22, duration = 0.6) => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: EASE },
  },
});
