import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import {
  Brain,
  MapPinned,
  Camera,
  BarChart3,
  ShieldCheck,
  Users,
  Clock,
  Trash2,
  Activity,
  Building2,
} from "lucide-react";

import { staggerGroup, popItem, cardPop } from "../../utils/motionVariants";
import ScrambleText from "../common/ScrambleText";
import GlowText from "../common/GlowText";
import TickingCounter from "../common/TickingCounter";

const ticker = [
  { icon: <Trash2 size={20} />, target: 24582, label: "Issues Detected" },
  { icon: <Activity size={20} />, target: 18947, label: "Reports Resolved" },
  { icon: <Building2 size={20} />, target: 132, label: "Cities Monitored" },
];

const features = [
  {
    icon: <Brain size={34} />,
    title: "AI Detection",
    text: "Detect waste, overflowing bins and sanitation issues using advanced AI vision."
  },
  {
    icon: <Camera size={34} />,
    title: "Smart Image Analysis",
    text: "Upload an image and receive instant classification with AI-powered insights."
  },
  {
    icon: <MapPinned size={34} />,
    title: "Interactive Heatmaps",
    text: "Visualize city-wide sanitation problems through dynamic heatmaps."
  },
  {
    icon: <BarChart3 size={34} />,
    title: "Analytics Dashboard",
    text: "Track reports, trends and cleanliness performance with live analytics."
  },
  {
    icon: <ShieldCheck size={34} />,
    title: "Verified Reporting",
    text: "AI-assisted validation helps reduce duplicate or inaccurate reports."
  },
  {
    icon: <Users size={34} />,
    title: "Community Driven",
    text: "Empower citizens and municipalities to work together for cleaner cities."
  }
];

// Card genuinely tilts toward wherever the cursor is over it (not a
// fixed hover angle), plus a soft radial highlight that follows the
// pointer — the "spotlight card" pattern used on a lot of dev-tool
// landing pages (Stripe, Linear, Vercel, etc).
function FeatureCard({ feature, index }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 22 });

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * 14);
    rotateX.set((0.5 - py) * 14);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const glowBackground = useTransform([glowX, glowY], ([gx, gy]) =>
    `radial-gradient(circle at ${gx}% ${gy}%, rgba(16,185,129,0.16), transparent 60%)`
  );

  return (
    <motion.div
      className="feature-card"
      variants={cardPop(index)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 900,
      }}
    >
      <motion.div
        className="feature-card-glow"
        style={{ background: glowBackground }}
        aria-hidden="true"
      />

      <motion.div
        className="feature-icon"
        initial={{ scale: 0, rotate: -120 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.09 + 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {feature.icon}
      </motion.div>

      <h3>{feature.title}</h3>

      <p>{feature.text}</p>
    </motion.div>
  );
}

function Features() {
  const sectionRef = useRef(null);

  // Drives the clock hand: as the person scrolls through the whole
  // Features section, the hand sweeps continuously (3 full turns),
  // instead of a fixed hover-triggered spin. This is the same
  // "rotate tied directly to scroll position" pattern used on a lot
  // of product/dashboard landing pages (Apple, Linear, etc) to make
  // an element feel like it's live-tracking the page, not just
  // decorative.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const clockRotation = useTransform(scrollYProgress, [0, 1], [0, 1080]);
  const secondHandRotation = useTransform(scrollYProgress, [0, 1], [0, 2160]);

  return (
    <section className="features-section" ref={sectionRef}>

      <motion.div
        className="features-header"
        variants={staggerGroup(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >

        <motion.span variants={popItem}>
          <ScrambleText text="WHY CIVICCLEAN AI" speed={28} />
        </motion.span>

        <motion.h2 variants={popItem}>
          <GlowText text="Powerful Features Designed" />
          <br />
          <GlowText text="For Smarter Cities" delay={0.2} />
        </motion.h2>

        <motion.p variants={popItem}>
          Everything required to detect, monitor and improve
          urban sanitation through Artificial Intelligence.
        </motion.p>

      </motion.div>

      <motion.div
        className="features-ticker"
        variants={staggerGroup(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >

        <motion.div className="ticker-item live-clock-item" variants={popItem}>
          <div className="live-clock">
            <Clock size={22} className="live-clock-face" />
            <motion.span
              className="live-clock-hand live-clock-hand-min"
              style={{ rotate: clockRotation }}
            />
            <motion.span
              className="live-clock-hand live-clock-hand-sec"
              style={{ rotate: secondHandRotation }}
            />
          </div>
          <div className="ticker-text">
            <h3>Live</h3>
            <span>Real-Time Monitoring</span>
          </div>
        </motion.div>

        {ticker.map((item, index) => (
          <motion.div className="ticker-item" key={index} variants={popItem}>
            <div className="ticker-icon">{item.icon}</div>
            <div className="ticker-text">
              <h3>
                <TickingCounter target={item.target} />
              </h3>
              <span>{item.label}</span>
            </div>
          </motion.div>
        ))}

      </motion.div>

      <div className="features-grid">

        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}

      </div>

    </section>
  );
}

export default Features;

    
