import { motion } from "framer-motion";
import { Leaf, Quote } from "lucide-react";

import { GlowText } from "../common/GlowText";

import "../../styles/community-stories.css";

const STORIES = [
  {
    name: "Amara Okafor",
    role: "Lagos, Nigeria",
    initials: "AO",
    hue: "#00c853",
    quote:
      "I reported an overflowing dump site near my kids' school. Three days later it was cleared, and now it's a community garden.",
  },
  {
    name: "Diego Ramirez",
    role: "Mexico City, Mexico",
    initials: "DR",
    hue: "#4fc3f7",
    quote:
      "The AI verification meant my report actually got prioritized instead of sitting in a queue for months.",
  },
  {
    name: "Priya Nair",
    role: "Kochi, India",
    initials: "PN",
    hue: "#34e37a",
    quote:
      "Our neighborhood WhatsApp group started using CivicClean together. We've logged over 300 cleanups this year.",
  },
  {
    name: "Tom Fischer",
    role: "Berlin, Germany",
    initials: "TF",
    hue: "#6d4c41",
    quote:
      "Seeing the map fill up with resolved pins turned cleanup from a chore into something genuinely satisfying to watch grow.",
  },
  {
    name: "Wanjiru Kamau",
    role: "Nairobi, Kenya",
    initials: "WK",
    hue: "#ffd23f",
    quote:
      "We used the dashboard data to convince our county council to fund two more waste collection routes.",
  },
];

// Deterministic-ish scatter for the drifting background leaves —
// just enough variety to not look mechanically repeated.
const LEAVES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: (i % 7) * 1.3,
  duration: 14 + (i % 5) * 3,
  size: 14 + (i % 4) * 6,
  drift: i % 2 === 0 ? 1 : -1,
}));

function CommunityStories() {
  return (
    <section className="cs-section">
      {/* Drifting leaves, purely decorative */}
      <div className="cs-leaves" aria-hidden="true">
        {LEAVES.map((leaf, i) => (
          <motion.span
            key={i}
            className="cs-leaf"
            style={{ left: leaf.left, width: leaf.size, height: leaf.size }}
            initial={{ y: "110vh", opacity: 0, rotate: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.7, 0.7, 0],
              rotate: 360 * leaf.drift,
              x: [0, 24 * leaf.drift, -12 * leaf.drift, 0],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Leaf size={leaf.size} />
          </motion.span>
        ))}
      </div>

      <div className="cs-header">
        <span className="cs-eyebrow">COMMUNITY VOICES</span>
        <h2>
          <GlowText text="Real People," color="0, 200, 83" /> <br />
          <GlowText text="Real Change" delay={0.15} color="79, 195, 247" />
        </h2>
      </div>

      <div className="cs-grid">
        {STORIES.map((s, i) => (
          <motion.div
            className="cs-card"
            key={s.name}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <div className="cs-blob" style={{ "--blob-hue": s.hue }}>
              <span>{s.initials}</span>
            </div>

            <Quote size={18} className="cs-quote-icon" />
            <p className="cs-quote">{s.quote}</p>

            <div className="cs-meta">
              <span className="cs-name">{s.name}</span>
              <span className="cs-role">{s.role}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CommunityStories;
