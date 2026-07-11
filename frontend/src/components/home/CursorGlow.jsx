import { useEffect, useRef } from "react";

// A soft radial light that quietly follows the cursor across the
// whole page — updates a CSS custom property directly on the node
// (no React re-render per mouse-move) so it stays cheap. Subtle by
// design: this is ambience, not a spotlight effect calling attention
// to itself.
export function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame;
    const handleMouseMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        node.style.setProperty("--cursor-x", `${e.clientX}px`);
        node.style.setProperty("--cursor-y", `${e.clientY}px`);
        frame = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="cursor-glow" />;
}

export default CursorGlow;

