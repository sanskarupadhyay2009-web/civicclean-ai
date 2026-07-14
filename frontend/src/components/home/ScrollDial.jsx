import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

/**
 * ScrollDial
 * ------------------
 * A large semicircle gauge — the "big sweeping needle" pattern used
 * on professional product/dashboard sites — tied directly to scroll
 * position across the whole Features section (not a fixed hover
 * animation, not a timer). The needle sweeps left-to-right and the
 * arc fills in as the person scrolls, tracing the real stages of
 * how the platform actually works. No invented statistics — the
 * labels describe the process, not a fabricated number.
 */

const STAGES = [
  "Detecting Issues",
  "AI Analysis",
  "Verification",
  "Resolution",
  "Cleaner Cities",
];

const CX = 150;
const CY = 158;
const R = 128;

function pointAt(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.sin(rad),
    y: CY - radius * Math.cos(rad),
  };
}

function ScrollDial() {
  const sectionRef = useRef(null);
  const [stageIndex, setStageIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  const needleAngle = useTransform(scrollYProgress, [0, 1], [-90, 90]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(STAGES.length - 1, Math.max(0, Math.floor(v * STAGES.length)));
    setStageIndex(idx);
  });

  const arcStart = pointAt(-90, R);
  const arcEnd = pointAt(90, R);
  const arcPath = `M ${arcStart.x} ${arcStart.y} A ${R} ${R} 0 0 1 ${arcEnd.x} ${arcEnd.y}`;

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = -90 + i * 18;
    const inner = pointAt(angle, R - 16);
    const outer = pointAt(angle, R);
    return { id: i, x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
  });

  const needleTip = { x: CX, y: CY - (R - 26) };

  return (
    <div ref={sectionRef} className="scroll-dial-wrap">
      <svg className="scroll-dial-svg" viewBox="0 0 300 180">
        <defs>
          <linearGradient id="dialArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--ce-emerald)" />
            <stop offset="100%" stopColor="var(--ce-sky)" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path d={arcPath} className="scroll-dial-track" fill="none" />

        {/* Progress fill — pathLength bound straight to scroll progress */}
        <motion.path
          d={arcPath}
          fill="none"
          stroke="url(#dialArcGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
        />

        {/* Tick marks */}
        {ticks.map((t) => (
          <line
            key={t.id}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            className="scroll-dial-tick"
          />
        ))}

        {/* Needle */}
        <motion.line
          x1={CX}
          y1={CY}
          x2={needleTip.x}
          y2={needleTip.y}
          className="scroll-dial-needle"
          style={{ rotate: needleAngle, transformOrigin: `${CX}px ${CY}px` }}
        />

        <circle cx={CX} cy={CY} r="7" className="scroll-dial-hub" />
      </svg>

      <div className="scroll-dial-stage">
        {STAGES.map((label, i) => (
          <span
            key={label}
            className={`scroll-dial-stage-label ${i === stageIndex ? "is-active" : ""}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ScrollDial;

