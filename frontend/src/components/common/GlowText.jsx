import { motion } from "framer-motion";

// Splits `text` into words, then into characters within each word,
// and reveals them one by one — each letter popping out of a soft
// neon blur into a crisp glow. Words are kept in their own
// non-breaking group so the line only ever wraps *between* words,
// never mid-word, and a real breakable space sits between them so
// long headings still reflow correctly on narrow screens.
export function GlowText({
  text,
  className = "",
  as = "span",
  stagger = 0.035,
  delay = 0,
  color = "16, 185, 129",
}) {
  const MotionTag = motion[as] || motion.span;
  const words = text.split(" ");

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const char = {
    hidden: {
      opacity: 0,
      y: 16,
      filter: "blur(6px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      textShadow: `0 0 14px rgba(${color}, 0.55)`,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
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
      {words.map((word, wi) => (
        <span className="glow-text-word" key={wi}>
          {word.split("").map((letter, li) => (
            <motion.span
              key={li}
              className="glow-text-char"
              variants={char}
              aria-hidden="true"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      )).reduce((acc, el, i) => (i === 0 ? [el] : [...acc, " ", el]), [])}
    </MotionTag>
  );
}

export default GlowText;
        
