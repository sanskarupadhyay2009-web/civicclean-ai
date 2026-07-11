import { motion } from "framer-motion";

// Splits `text` into characters and reveals them one by one, each
// popping up out of a soft neon blur into a crisp glow — the kind of
// staggered, glowing letter reveal used on a lot of flashy product
// landing pages. Triggers once when scrolled into view.
export function GlowText({
  text,
  className = "",
  as = "span",
  stagger = 0.035,
  delay = 0,
  color = "16, 185, 129",
}) {
  const MotionTag = motion[as] || motion.span;

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const char = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: "blur(8px)",
      textShadow: `0 0 0px rgba(${color}, 0)`,
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      textShadow: [
        `0 0 18px rgba(${color}, 0.9)`,
        `0 0 6px rgba(${color}, 0.35)`,
      ],
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionTag
      className={`glow-text ${className}`}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      aria-label={text}
    >
      {text.split("").map((letter, i) => (
        <motion.span
          key={i}
          className="glow-text-char"
          variants={char}
          aria-hidden="true"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </MotionTag>
  );
}

export default GlowText;

