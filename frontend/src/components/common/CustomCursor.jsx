import { useEffect, useRef } from "react";

// A soft glowing "leaf" cursor that trails behind the pointer and
// releases an expanding ripple on click. Disabled automatically on
// touch devices, where there is no real cursor to replace.
function CustomCursor() {
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const trailRef = useRef([]);
  const rafRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return undefined;

    document.documentElement.classList.add("ce-cursor-active");

    const handleMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const handleDown = (e) => {
      const ripple = document.createElement("span");
      ripple.className = "ce-cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    const tick = () => {
      // Dot snaps instantly, glow eases behind it for a soft trailing feel
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.15;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x}px, ${glowPos.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("ce-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="ce-cursor-glow" aria-hidden="true" />
      <div ref={dotRef} className="ce-cursor-dot" aria-hidden="true">
        🍃
      </div>
    </>
  );
}

export default CustomCursor;
        
