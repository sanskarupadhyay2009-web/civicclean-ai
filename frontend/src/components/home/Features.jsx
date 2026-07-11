import { motion } from "framer-motion";
import {
  Brain,
  MapPinned,
  Camera,
  BarChart3,
  ShieldCheck,
  Users
} from "lucide-react";

import { staggerGroup, popItem, cardPop } from "../../utils/motionVariants";
import ScrambleText from "../common/ScrambleText";
import GlowText from "../common/GlowText";

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

      <div className="features-grid">

        {features.map((feature, index) => (

          <motion.div
            key={index}
            className="feature-card"
            variants={cardPop(index)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            whileHover={{
              y: -10,
              rotateX: 6,
              rotateZ: index % 2 ? -1.5 : 1.5,
              scale: 1.03,
              transition: { duration: 0.35, ease: "easeOut" },
            }}
          >

            <motion.div
              className="feature-icon"
              initial={{ scale: 0, rotate: -120 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.09 + 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            >

              {feature.icon}

            </motion.div>

            <h3>

              {feature.title}

            </h3>

            <p>

              {feature.text}

            </p>

          </motion.div>

        ))}

      </div>

    </section>
  );
}

export default Features;
                           
