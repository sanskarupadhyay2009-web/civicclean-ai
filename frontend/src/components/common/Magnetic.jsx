import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMemo } from "react";

const SPRING = { stiffness: 300, damping: 20, mass: 0.5 };
const STRENGTH = 0.35; // how much of the cursor offset gets applied
const MAX_OFFSET = 14; // px cap so the element never drifts too far

// Wraps any element (button, react-router Link, etc.) so it gently
// pulls toward the cursor while hovered and springs back on leave —
// the small, tactile "magnetic button" touch used across a lot of
// polished product/agency sites. Purely a hover affordance; falls
// back to a normal static element for anyone using touch/keyboard.
export function Magnetic({ as: Component = "button", className = "", children, ...props }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const MotionComponent = useMemo(
    () => (motion.create ? motion.create(Component) : motion(Component)),
    [Component]
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetX * STRENGTH)));
    y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetY * STRENGTH)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionComponent
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

export default Magnetic;

