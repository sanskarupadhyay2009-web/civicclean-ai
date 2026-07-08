import { motion } from "framer-motion";
import {
  Brain,
  MapPinned,
  Camera,
  BarChart3,
  ShieldCheck,
  Users
} from "lucide-react";

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

      <div className="features-header">

        <span>WHY CIVICCLEAN AI</span>

        <h2>
          Powerful Features Designed
          <br />
          For Smarter Cities
        </h2>

        <p>
          Everything required to detect, monitor and improve
          urban sanitation through Artificial Intelligence.
        </p>

      </div>

      <div className="features-grid">

        {features.map((feature, index) => (

          <motion.div
            key={index}
            className="feature-card"
            initial={{
              opacity: 0,
              y: 70
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: index * 0.08
            }}
            viewport={{
              once: true
            }}
          >

            <div className="feature-icon">

              {feature.icon}

            </div>

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