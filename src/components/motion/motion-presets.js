// Fast out of the gate, then gently settles. This is the same family of
// easing used by polished editorial/product sites for scroll reveals.
export const EASE = [0.22, 1, 0.36, 1];

// Reveal once and leave the content settled. Reversing dozens of elements as
// they cross the viewport edge makes the page feel like it is chasing scroll.
export const VIEWPORT = {
  once: true,
  amount: 0.14,
  margin: "0px 0px -8% 0px",
};
export const VIEWPORT_TIGHT = {
  once: true,
  amount: 0.08,
  margin: "0px 0px -4% 0px",
};

export const fadeUp = (delay = 0, y = 18, duration = 0.6) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: EASE },
  viewport: VIEWPORT,
});

export const fadeRight = (delay = 0, x = 18, duration = 0.6) => ({
  initial: { opacity: 0, x: -x },
  whileInView: { opacity: 1, x: 0 },
  transition: { duration, delay, ease: EASE },
  viewport: VIEWPORT,
});

export const staggerContainer = (staggerChildren = 0.07, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

export const staggerItem = (y = 18, duration = 0.58) => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: EASE },
  },
});
