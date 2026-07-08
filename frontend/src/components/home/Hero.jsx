import { motion } from "framer-motion";
import {
  Sparkles,
  Send,
  ThumbsUp,
  Users,
  ShoppingBag,
  CheckCircle2,
  Trees,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

import HeroCityImage from "./city/HeroCityImage";
import FloatingCards from "./FloatingCards";
import ScrollIndicator from "./city/ScrollIndicator";

import "../../styles/home.css";
import "../../styles/hero-city-image.css";

const stats = [
  { icon: Users, value: "2,458+", label: "Active Citizens" },
  { icon: ShoppingBag, value: "18,392+", label: "Issues Reported" },
  { icon: CheckCircle2, value: "14,876+", label: "Issues Resolved" },
  { icon: Trees, value: "860+", label: "Tons of Waste Cleared" },
  { icon: Star, value: "4.9/5", label: "Community Rating" },
];

function Hero() {
  return (
    <section className="hero-section">
      {/* Background Glow */}

      <div className="hero-glow hero-glow-left"></div>
      <div className="hero-glow hero-glow-right"></div>

      <div className="container hero-container">
        {/* ==========================
            LEFT CONTENT
        =========================== */}

        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.6,
            }}
          >
            <Sparkles size={16} />

            <span>AI Powered. Community Driven.</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.25,
              duration: 0.8,
            }}
          >
            Cleaner Cities,
            <br />
            Better{" "}
            <span className="gradient-text">Tomorrow</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
            }}
          >
            CivicClean AI uses artificial intelligence and real-time data to
            detect, analyze, and resolve cleanliness issues across your city.
            Together, we can build cleaner, greener, and healthier
            communities.
          </motion.p>

          {/* CTA */}

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.55,
              duration: 0.8,
            }}
          >
            <Link to="/report" className="hero-primary-btn">
              <Send size={18} />
              Report an Issue
            </Link>

            <Link to="/dashboard" className="hero-secondary-btn">
              <ThumbsUp size={18} />
              Explore Dashboard
            </Link>
          </motion.div>

          {/* Trust row */}

          <motion.div
            className="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.65,
              duration: 0.8,
            }}
          >
            <span className="trust-label">Trusted by communities</span>

            <div className="trust-row">
              <div className="trust-avatars">
                {["RS", "AK", "IB", "SP"].map((initials, i) => (
                  <div
                    key={i}
                    className="trust-avatar"
                    style={{
                      background: [
                        "linear-gradient(135deg,#10B981,#059669)",
                        "linear-gradient(135deg,#34D399,#047857)",
                        "linear-gradient(135deg,#6EE7B7,#10B981)",
                        "linear-gradient(135deg,#059669,#065F46)",
                      ][i],
                    }}
                  >
                    {initials}
                  </div>
                ))}
                <div className="trust-avatar trust-count">2K+</div>
              </div>

              <p>
                Join 2,000+ active citizens
                <br />
                making a real difference
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ==========================
             RIGHT — CITY VISUAL
        =========================== */}

        <motion.div
          className="hero-right"
          initial={{
            opacity: 0,
            x: 80,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          <HeroCityImage />

          <FloatingCards />
        </motion.div>
      </div>

      {/* ==========================
           FULL-WIDTH STATS BAR
      =========================== */}

      <motion.div
        className="hero-stats-bar"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.8,
        }}
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;

          return (
            <div className="hero-stat-item" key={i}>
              <div className="hero-stat-icon">
                <Icon size={20} />
              </div>

              <div>
                <h2>{stat.value}</h2>
                <span>{stat.label}</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Scroll */}

      <ScrollIndicator />
    </section>
  );
}

export default Hero;
            
