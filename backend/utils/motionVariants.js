// Shared scroll-reveal variants — punchy, staggered, elastic-overshoot
// easing to get that "anime.js" pop instead of a plain fade/slide.

// Classic back-out overshoot curve: elements pop slightly past their
// resting scale/position before settling — the signature elastic feel.
export const ELASTIC_EASE = [0.34, 1.56, 0.64, 1];
export const SMOOTH_EASE = [0.16, 1, 0.3, 1];

export const staggerGroup = (stagger = 0.12, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const popItem = {
  hidden: { opacity: 0, y: 46, rotateX: -30, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.7, ease: SMOOTH_EASE },
  },
};

export const cardPop = (i = 0) => ({
  hidden: { opacity: 0, y: 70, rotateX: -28, rotateZ: i % 2 ? 3 : -3, scale: 0.82 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateZ: 0,
    scale: 1,
    transition: { duration: 0.75, delay: i * 0.09, ease: ELASTIC_EASE },
  },
});

export const slideIn = (dir = 1, i = 0) => ({
  hidden: { opacity: 0, x: 70 * dir, rotateY: 25 * dir },
  show: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: ELASTIC_EASE },
  },
});

export const flipIn = {
  hidden: { opacity: 0, rotateY: -85, scale: 0.85 },
  show: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: { duration: 0.9, ease: SMOOTH_EASE },
  },
};

