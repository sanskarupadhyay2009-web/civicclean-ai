import { motion } from "framer-motion";
import { Leaf, Camera, MapPin, Users, Sparkles } from "lucide-react";

import "../styles/about.css";

const steps = [
  {
    icon: Camera,
    title: "Snap a Photo",
    text: "Spot litter, illegal dumping, or overflowing bins? Take a picture right from your phone.",
  },
  {
    icon: Sparkles,
    title: "AI Analyzes It",
    text: "Our AI instantly identifies the waste type, category and severity, so reports are accurate and actionable.",
  },
  {
    icon: MapPin,
    title: "Location Tagged",
    text: "Your report is automatically tagged with the location, helping local teams find and resolve it faster.",
  },
  {
    icon: Users,
    title: "Community Powered",
    text: "Every report contributes to a shared map of cleanliness issues that your community and local authorities can act on.",
  },
];

function About() {
  return (
    <motion.main
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="about-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Leaf size={48} />
        <h1>About CivicClean AI</h1>
        <p>
          CivicClean AI helps communities keep their neighborhoods clean by
          making it effortless to spot, report, and track waste and pollution
          issues — powered by AI.
        </p>
      </motion.div>

      <div className="about-grid">
        {steps.map((step, i) => {
          const Icon = step.icon;

          return (
            <motion.div
              className="glass-card about-card"
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Icon size={34} />
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="glass-card about-mission"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Our Mission</h2>
        <p>
          We believe cleaner cities start with easier reporting. By pairing
          everyday citizens with AI-powered waste detection, CivicClean AI
          turns a quick photo into real, trackable civic action — no
          paperwork, no phone calls, just a snapshot and a few taps.
        </p>
      </motion.div>
    </motion.main>
  );
}

export default About;
