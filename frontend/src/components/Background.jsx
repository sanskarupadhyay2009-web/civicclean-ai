import { useMemo } from "react";

const DRIFT_WORDS = [
  "SUSTAINABILITY",
  "CLEAN AIR",
  "RECYCLE",
  "COMMUNITY",
  "GREEN FUTURE",
  "ZERO WASTE",
];

function Background() {
  // Randomized once per mount so stars don't re-shuffle on re-render.
  const stars = useMemo(
    () =>
      [...Array(90)].map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: 2 + Math.random() * 4,
        delay: Math.random() * 6,
      })),
    []
  );

  const shootingStars = useMemo(
    () =>
      [...Array(4)].map((_, i) => ({
        id: i,
        top: Math.random() * 50,
        left: Math.random() * 60,
        delay: i * 4.5 + Math.random() * 3,
        duration: 1.6 + Math.random(),
      })),
    []
  );

  return (
    <div aria-hidden="true" className="app-background">
      <div className="space-nebula space-nebula-1" />
      <div className="space-nebula space-nebula-2" />
      <div className="space-nebula space-nebula-3" />

      <div className="space-stars">
        {stars.map((star) => (
          <span
            key={star.id}
            className="space-star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="space-shooting-stars">
        {shootingStars.map((s) => (
          <span
            key={s.id}
            className="space-shooting-star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="space-drift-words">
        {DRIFT_WORDS.map((word, i) => (
          <span
            key={word}
            className="space-drift-word"
            style={{
              top: `${10 + i * 16}%`,
              animationDuration: `${34 + i * 6}s`,
              animationDelay: `${i * -7}s`,
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Background;
