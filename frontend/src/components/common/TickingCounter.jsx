import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/**
 * TickingCounter
 * ------------------
 * The "counting number" pattern used all over professional product
 * sites (Stripe, Linear, Vercel-style landers): once scrolled into
 * view, digits count up with eased motion, then — instead of just
 * stopping — the number keeps ticking upward at a slow, irregular
 * interval, like a live/real-time counter. Each digit rolls in its
 * own vertical "odometer" slot rather than the whole number just
 * re-rendering, which is what makes it read as a clock/meter rather
 * than a plain animated number.
 */

function TickingCounter({ target, prefix = "", suffix = "", duration = 1.8 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let rafId;
    let intervalId;
    const start = performance.now();

    const countUp = (now) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(countUp);
      } else {
        // Reached the real value — keep it feeling "live" from here on.
        intervalId = setInterval(() => {
          setDisplay((d) => d + Math.floor(Math.random() * 4) + 1);
        }, 2200 + Math.random() * 1800);
      }
    };

    rafId = requestAnimationFrame(countUp);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(intervalId);
    };
  }, [isInView, target, duration]);

  const digits = display.toLocaleString().split("");

  return (
    <span ref={ref} className="ticking-counter">
      {prefix}

      {digits.map((d, i) =>
        d === "," ? (
          <span key={`sep-${i}`} className="ticking-comma">
            ,
          </span>
        ) : (
          <span key={`slot-${i}`} className="ticking-digit-slot">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={d}
                className="ticking-digit"
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </span>
        )
      )}

      {suffix}
    </span>
  );
}

export default TickingCounter;

