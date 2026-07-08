import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Bot, Trash2, Recycle } from "lucide-react";

const TOTAL_DURATION_MS = 10000;
const LOGO_TEXT = "CivicClean AI";

function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), TOTAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="intro-bg" />

          <div className="intro-particles">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="intro-particle"
                style={{
                  left: `${(i * 137) % 100}%`,
                  animationDelay: `${(i % 7) * 0.6}s`,
                  animationDuration: `${4 + (i % 5)}s`,
                }}
              />
            ))}
          </div>

          <div className="intro-stage">
            <div className="intro-sprout">
              <svg viewBox="0 0 100 140" className="intro-sprout-svg">
                <path
                  className="intro-stem"
                  d="M50 140 L50 55"
                  stroke="#34D399"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  className="intro-leaf intro-leaf-1"
                  d="M50 85 C 20 75, 15 40, 45 35 C 50 60, 50 70, 50 85 Z"
                  fill="#10B981"
                />
                <path
                  className="intro-leaf intro-leaf-2"
                  d="M50 65 C 80 55, 85 20, 55 15 C 50 35, 50 50, 50 65 Z"
                  fill="#34D399"
                />
              </svg>
            </div>

            <div className="intro-ground" />

            <div className="intro-bin">
              <Recycle size={30} />
            </div>

            <motion.div
              className="intro-bot"
              initial={{ x: -160, opacity: 0 }}
              animate={{ x: 140, opacity: [0, 1, 1, 0] }}
              transition={{
                delay: 3.6,
                duration: 2.4,
                times: [0, 0.15, 0.85, 1],
                ease: "easeInOut",
              }}
            >
              <Bot size={34} />
              <motion.div
                className="intro-trash"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0] }}
                transition={{ delay: 3.6, duration: 2.4, times: [0, 0.75, 0.85] }}
              >
                <Trash2 size={16} />
              </motion.div>
            </motion.div>

            <motion.div
              className="intro-cleaned-tag"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 1, 0], y: [10, -5, -5, -15] }}
              transition={{ delay: 5.8, duration: 1.1 }}
            >
              +1 Cleaned ✓
            </motion.div>

            <div className="intro-logo">
              {LOGO_TEXT.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="intro-logo-letter"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 6.6 + i * 0.045,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}

              <motion.div
                className="intro-logo-leaf"
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 7.2, duration: 0.5, ease: "backOut" }}
              >
                <Leaf size={22} />
              </motion.div>
            </div>

            <motion.p
              className="intro-tagline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 8.3, duration: 0.7 }}
            >
              Cleaner Cities, Better Tomorrow.
            </motion.p>
          </div>

          <div className="intro-progress-track">
            <motion.div
              className="intro-progress-fill"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
