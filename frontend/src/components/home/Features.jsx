import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Brain,
  MapPinned,
  Camera,
  BarChart3,
  ShieldCheck,
  Users,
} from "lucide-react";

import { staggerGroup, popItem, cardPop } from "../../utils/motionVariants";
import { GlowText } from "../common/GlowText";
import ScrollDial from "./ScrollDial";

const features = [
  {
    icon: <Brain size={30} />,
    title: "AI Detection",
    text: "Detect waste, overflowing bins and sanitation issues using advanced AI vision.",
  },
  {
    icon: <Camera size={30} />,
    title: "Smart Image Analysis",
    text: "Upload an image and receive instant classification with AI-powered insights.",
  },
  {
    icon: <MapPinned size={30} />,
    title: "Interactive Heatmaps",
    text: "Visualize city-wide sanitation problems through dynamic heatmaps.",
  },
  {
    icon: <BarChart3 size={30} />,
    title: "Analytics Dashboard",
    text: "Track reports, trends and cleanliness performance with live analytics.",
  },
  {
    icon: <ShieldCheck size={30} />,
    title: "Verified Reporting",
    text: "AI-assisted validation helps reduce duplicate or inaccurate reports.",
  },
  {
    icon: <Users size={30} />,
    title: "Community Driven",
    text: "Empower citizens and municipalities to work together for cleaner cities.",
  },
];

// A glass card that idles with a slow, gentle float, tilts toward the
// cursor in 3D, and shows a soft radial glow + gradient rim wherever
// the pointer is — the "premium interactive card" pattern used on
// modern product sites (Linear, Vercel, Stripe), reskinned to the
// forest/aurora palette instead of a flat tech-SaaS look.
function FeatureCard({ feature, index }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * 12);
    rotateX.set((0.5 - py) * 12);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const glowBackground = useTransform([glowX, glowY], ([gx, gy]) =>
    `radial-gradient(circle at ${gx}% ${gy}%, rgba(0,200,83,0.22), transparent 60%)`
  );

  return (
    <motion.div
      className="feature-card"
      variants={cardPop(index)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 900,
      }}
    >
      <motion.div
        className="feature-card-float"
        animate={{ y: [0, -7, 0] }}
        transition={{
          duration: 5 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3,
        }}
      >
        <motion.div
          className="feature-card-glow"
          style={{ background: glowBackground }}
          aria-hidden="true"
        />

        <motion.div
          className="feature-icon"
          initial={{ scale: 0, rotate: -100 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: index * 0.08 + 0.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {feature.icon}
        </motion.div>

        <h3>{feature.title}</h3>
        <p>{feature.text}</p>
      </motion.div>
    </motion.div>
  );
}

function Features() {
  return (
    <section className="features-section">
      <motion.div
        className="features-header"
        variants={staggerGroup(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <motion.span className="features-eyebrow" variants={popItem}>
          How CivicClean AI Works
        </motion.span>

        <motion.h2 variants={popItem}>
          <GlowText text="Powerful Features Designed" color="0, 200, 83" />
          <br />
          <GlowText text="For Smarter Cities" color="79, 195, 247" delay={0.2} />
        </motion.h2>

        <motion.p variants={popItem}>
          Everything required to detect, monitor and improve urban
          sanitation through Artificial Intelligence.
        </motion.p>
      </motion.div>

      <ScrollDial />

      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Features;
      
