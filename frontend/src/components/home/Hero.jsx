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

import CityScene from "./city/CityScene";

import ScrollIndicator from "./city/ScrollIndicator";
import GlowText from "../common/GlowText";
import Magnetic from "../common/Magnetic";

import "../../styles/home.css";

const stats = [
  { icon: Users, value: "Community Driven", label: "Built with citizen reports" },
  { icon: ShoppingBag, value: "Real-Time Reporting", label: "Report issues in seconds" },
  { icon: CheckCircle2, value: "AI Verified", label: "Every report analyzed by AI" },
  { icon: Trees, value: "Cleaner Neighborhoods", label: "Track cleanup progress" },
  { icon: Star, value: "Growing Every Day", label: "Join the movement" },
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
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <GlowText text="Cleaner Cities," delay={0.25} />
            <br />
            <GlowText text="Better" delay={0.55} />{" "}
            <motion.span
              className="gradient-text"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Tomorrow
            </motion.span>
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
            <Magnetic as={Link} to="/report" className="hero-primary-btn">
              <Send size={18} />
              Report an Issue
            </Magnetic>

            <Magnetic as={Link} to="/dashboard" className="hero-secondary-btn">
              <ThumbsUp size={18} />
              Explore Dashboard
            </Magnetic>
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
          <CityScene />


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


                           
