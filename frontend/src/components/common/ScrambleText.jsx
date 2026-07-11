import { motion } from "framer-motion";
import { useState, useRef } from "react";

const CYBER_CHARS = "01XØ█▓▒░►▼▲◀▶§#$@%+*=-_";

// Reveals `text` letter-by-letter through a scramble/glitch decode
// the moment it scrolls into view — the "terminal decrypting a
// string" effect. Fires once per mount (viewport once: true) so it
// doesn't re-scramble every time you scroll past it again.
export function ScrambleText({ text, speed = 40, className = "" }) {
  const [displayText, setDisplayText] = useState(text);
  const iterationsRef = useRef(0);
  const intervalRef = useRef(null);

  const triggerScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    iterationsRef.current = 0;

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((letter, index) => {
            // Once past this letter's threshold, lock it to the real character
            if (index < iterationsRef.current) {
              return text[index];
            }
            if (letter === " ") return " ";
            return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)];
          })
          .join("")
      );

      iterationsRef.current += 1 / 3;
      if (iterationsRef.current >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  };

  return (
    <motion.span
      className={`scramble-text ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={triggerScramble}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
}

export default ScrambleText;

