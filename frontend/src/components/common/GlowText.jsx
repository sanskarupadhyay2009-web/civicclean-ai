import { motion } from "framer-motion";

// A clean, single-unit reveal for headings: fades/slides up out of a
// soft blur as it scrolls into view, with a gentle glow settling in
// once it lands. No letter-by-letter splitting — just one smooth,
// confident motion, the way most polished product sites do it.
export function GlowText({
  text,
  className = "",
  as = "span",
  delay = 0,
  color = "16, 185, 129",
}) {
  const MotionTag = motion[as] || motion.span;

  return (
    <MotionTag
      className={`glow-text ${className}`}
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        textShadow: `0 0 18px rgba(${color}, 0.35)`,
      }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </MotionTag>
  );
}

export default GlowText;
