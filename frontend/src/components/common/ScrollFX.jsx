import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

// ─────────────────────────────────────────────
//  ORB — a soft glow that drifts up/down at its
//  own speed relative to scroll, creating layered
//  parallax depth through the empty background.
// ─────────────────────────────────────────────
function ScrollOrb({ top, left, size, factor, color, delay, smoothY }) {
  const y = useTransform(smoothY, (v) => v * factor);
  const rotate = useTransform(smoothY, (v) => v * factor * 6);

  return (
    <motion.div
      className="scrollfx-orb"
      style={{
        top,
        left,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(${color},0.4), transparent 70%)`,
        y,
        rotate,
      }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.85, 0.45] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// ─────────────────────────────────────────────
//  COMET — a streak that races diagonally through
//  the empty space; brighter + faster the harder
//  you scroll (driven by scroll velocity).
// ─────────────────────────────────────────────
function ScrollComet({ top, reverse, delay, scrollY }) {
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 400, damping: 40 });
  const boost = useTransform(smoothVelocity, [-2500, 0, 2500], [1, 0.35, 1]);
  const glow = useTransform(smoothVelocity, [-2500, 0, 2500], [1, 0.4, 1]);

  return (
    <motion.div
      className={`scrollfx-comet${reverse ? " scrollfx-comet-rev" : ""}`}
      style={{ top, scaleX: boost, opacity: glow }}
      animate={{ x: reverse ? ["110%", "-30%"] : ["-30%", "110%"] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "linear", delay }}
    />
  );
}

// ─────────────────────────────────────────────
//  GRID — a faint neon mesh that slides slowly
//  and shifts with scroll, filling dead space
//  with quiet motion instead of flat darkness.
// ─────────────────────────────────────────────
function ScrollGrid({ smoothY }) {
  const backgroundPositionY = useTransform(smoothY, (v) => `${v * 0.12}px`);

  return (
    <motion.div
      className="scrollfx-grid"
      style={{ backgroundPositionY }}
    />
  );
}

// Trimmed from 6 orbs to 4 — each one is a large blurred div running
// its own infinite scale/opacity loop on top of a scroll-linked
// transform. Six of them (plus 3 comets, plus the city skyline's own
// filters) was too much concurrent blur/animation work for one page.
const ORBS = [
  { top: "6%",  left: "8%",  size: 260, factor: 0.14,  color: "16,185,129",  delay: 0 },
  { top: "34%", left: "84%", size: 220, factor: -0.22, color: "52,211,153",  delay: 1 },
  { top: "62%", left: "12%", size: 300, factor: 0.24,  color: "110,231,183", delay: 2 },
  { top: "88%", left: "70%", size: 240, factor: -0.2,  color: "5,150,105",   delay: 1.4 },
];

function ScrollFX() {
  // One shared scroll listener for the whole layer — every orb/comet/grid
  // below derives its own motion from this single spring value.
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 55, damping: 20, mass: 0.4 });

  return (
    <div className="scrollfx-layer" aria-hidden="true">
      <ScrollGrid smoothY={smoothY} />

      {ORBS.map((o, i) => (
        <ScrollOrb key={i} {...o} smoothY={smoothY} />
      ))}

      <ScrollComet top="22%" delay={0} scrollY={scrollY} />
      <ScrollComet top="70%" reverse delay={1.8} scrollY={scrollY} />
    </div>
  );
}

export default ScrollFX;
