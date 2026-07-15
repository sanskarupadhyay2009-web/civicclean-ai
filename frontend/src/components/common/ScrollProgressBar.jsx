import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgressBar
 * ------------------
 * A slim glowing bar pinned to the very top of the viewport that
 * fills left-to-right with overall page scroll progress. Springy
 * rather than 1:1 with scroll, so it reads as alive rather than
 * mechanical.
 */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    mass: 0.4,
  });

  return <motion.div className="scroll-progress-bar" style={{ scaleX }} />;
}

export default ScrollProgressBar;

