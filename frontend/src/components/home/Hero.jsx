import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  TreePine,
  TreeDeciduous,
  Flower2,
  Bird,
  Cloud,
  ChevronDown,
} from "lucide-react";

// The hero is a scroll-driven sequence: the page starts grey and
// polluted, and as the visitor scrolls through the extra height of
// this section, the sky clears, grass and trees grow in, flowers
// bloom, birds arrive, and the sun breaks through — all tied directly
// to scroll progress via one shared motion value.
function Hero() {
  const wrapRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const skyGrayOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const skyBlueOpacity = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const sunOpacity = useTransform(scrollYProgress, [0.5, 0.85], [0, 1]);

  const grassScale = useTransform(scrollYProgress, [0.08, 0.35], [0, 1]);
  const treesOpacity = useTransform(scrollYProgress, [0.18, 0.48], [0, 1]);
  const treesScale = useTransform(scrollYProgress, [0.18, 0.5], [0.25, 1]);
  const flowersOpacity = useTransform(scrollYProgress, [0.38, 0.62], [0, 1]);
  const flowersScale = useTransform(scrollYProgress, [0.38, 0.65], [0.3, 1]);

  const birdX = useTransform(scrollYProgress, [0.45, 0.88], ["-15vw", "115vw"]);
  const birdOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.55, 0.78, 0.88],
    [0, 1, 1, 0]
  );

  const contentY = useTransform(scrollYProgress, [0.7, 1], [0, -70]);
  const contentFade = useTransform(scrollYProgress, [0.82, 1], [1, 0]);

  return (
    <section ref={wrapRef} className="ce-hero-wrap">
      <div className="ce-hero-sticky">

        {/* ---------- Sky ---------- */}
        <motion.div className="ce-hero-sky ce-hero-sky-gray" style={{ opacity: skyGrayOpacity }} />
        <motion.div className="ce-hero-sky ce-hero-sky-blue" style={{ opacity: skyBlueOpacity }} />
        <motion.div className="ce-hero-sunrays" style={{ opacity: sunOpacity }} />

        {/* ---------- Clouds (always drifting, gently) ---------- */}
        <div className="ce-hero-clouds">
          <Cloud className="ce-cloud ce-cloud-1" />
          <Cloud className="ce-cloud ce-cloud-2" />
          <Cloud className="ce-cloud ce-cloud-3" />
        </div>

        {/* ---------- Birds ---------- */}
        <motion.div className="ce-hero-birds" style={{ x: birdX, opacity: birdOpacity }}>
          <Bird size={22} />
          <Bird size={18} />
          <Bird size={20} />
        </motion.div>

        {/* ---------- Trees ---------- */}
        <motion.div
          className="ce-hero-trees"
          style={{ opacity: treesOpacity, scale: treesScale }}
        >
          {[TreePine, TreeDeciduous, TreePine, TreeDeciduous, TreePine, TreeDeciduous, TreePine].map(
            (TreeIcon, i) => (
              <TreeIcon key={i} className={`ce-tree ce-tree-${i % 5}`} />
            )
          )}
        </motion.div>

        {/* ---------- Flowers ---------- */}
        <motion.div
          className="ce-hero-flowers"
          style={{ opacity: flowersOpacity, scale: flowersScale }}
        >
          {[...Array(8)].map((_, i) => (
            <Flower2 key={i} className={`ce-flower ce-flower-${i % 6}`} />
          ))}
        </motion.div>

        {/* ---------- Grass ---------- */}
        <motion.div className="ce-hero-grass" style={{ scaleY: grassScale }} />

        {/* ---------- Fireflies (dusk feel near the end) ---------- */}
        <div className="ce-hero-fireflies">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="ce-firefly"
              style={{
                left: `${8 + i * 9}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* ---------- Content ---------- */}
        <motion.div className="ce-hero-content" style={{ y: contentY, opacity: contentFade }}>

          <motion.span
            className="ce-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Leaf size={14} /> AI Powered {"\u00B7"} Community Driven
          </motion.span>

          <motion.h1
            className="ce-hero-title ce-display"
            initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Together We Can Build
            <br />
            A <span>Cleaner Tomorrow</span>
          </motion.h1>

          <motion.p
            className="ce-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            CivicClean AI helps citizens detect, report and resolve
            sanitation issues {"\u2014"} turning grey cities back into green ones.
          </motion.p>

          <motion.div
            className="ce-hero-actions"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15, delayChildren: 1.1 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.15 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
                },
              }}
            >
              <Link to="/report" className="ce-btn ce-btn-primary ce-glow-border">
                <Leaf size={16} /> Report an Issue
              </Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.15 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
                },
              }}
            >
              <Link to="/dashboard" className="ce-btn ce-btn-ghost">
                Explore Dashboard <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="ce-hero-scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <span className="ce-scroll-beam" />
            <ChevronDown size={22} className="ce-scroll-arrow" />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
        
