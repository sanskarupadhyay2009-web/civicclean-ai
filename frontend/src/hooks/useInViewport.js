import { useEffect, useRef, useState } from "react";

/**
 * useInViewport
 * ------------------
 * Tracks whether an element is anywhere near the viewport, so expensive
 * work (WebGL render loops, particle updates, heavy CSS animations) can
 * be paused entirely when a section is scrolled far away instead of
 * running forever in the background.
 *
 * `rootMargin` defaults to a generous 400px so the canvas "wakes up"
 * slightly before it's actually on screen — avoids a visible blank
 * frame/pop-in as the user scrolls toward it.
 *
 * Usage:
 *   const [ref, inView] = useInViewport();
 *   <div ref={ref}><Canvas frameloop={inView ? "always" : "never"} /></div>
 */
export function useInViewport({ rootMargin = "400px 0px", threshold = 0 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(true); // assume visible on first paint

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView];
}

export default useInViewport;
