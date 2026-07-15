import { motion } from "framer-motion";

import { GlowText } from "../common/GlowText";
import TickingCounter from "../common/TickingCounter";
import { ScrambleText } from "../common/ScrambleText";
import EarthImpactGlobe from "./EarthImpactGlobe";

import "../../styles/earthimpact.css";

function EarthImpact() {
  return (
    <section className="earth-section">
      <div className="earth-container">
        <motion.div
          className="earth-copy"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="earth-eyebrow">
            <ScrambleText text="GLOBAL IMPACT" />
          </span>

          <h2>
            <GlowText text="One Planet," /> <br />
            <GlowText text="Thousands of Hands" delay={0.15} />
          </h2>

          <p>
            Every report, every cleanup, every citizen counts. Drag the
            globe to explore where CivicClean AI communities are already
            making their cities greener.
          </p>

          <div className="earth-metrics">
            <div className="earth-metric">
              <span className="earth-metric-value">
                <TickingCounter target={482300} suffix=" kg" />
              </span>
              <span className="earth-metric-label">CO₂ Reduction Tracked</span>
            </div>

            <div className="earth-metric">
              <span className="earth-metric-value">
                <TickingCounter target={12480} />
              </span>
              <span className="earth-metric-label">Trees Planted</span>
            </div>

            <div className="earth-metric">
              <span className="earth-metric-value">
                <TickingCounter target={54} suffix=" countries" />
              </span>
              <span className="earth-metric-label">Active Communities</span>
            </div>
          </div>

          <div className="earth-legend">
            <span className="earth-legend-dot earth-legend-dot-high" /> High participation
            <span className="earth-legend-dot earth-legend-dot-low" /> Growing community
          </div>
        </motion.div>

        <motion.div
          className="earth-globe-wrap"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <EarthImpactGlobe />
          <span className="earth-globe-hint">Drag to rotate</span>
        </motion.div>
      </div>
    </section>
  );
}

export default EarthImpact;
            
