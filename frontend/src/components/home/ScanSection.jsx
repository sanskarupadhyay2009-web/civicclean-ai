import { motion } from "framer-motion";
import { UploadCloud, ScanLine, Zap, BrainCircuit, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

import { staggerGroup, popItem, flipIn } from "../../utils/motionVariants";
import { GlowText } from "../common/GlowText";

function ScanSection() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setScanned(false);

    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2500);
  };

  return (
    <section className="scan-section">
      <div className="scan-container">
        {/* LEFT INFO */}
        <motion.div
          className="scan-left"
          variants={staggerGroup(0.14)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.span className="scan-badge" variants={popItem}>
            <Sparkles size={15} />
            Live Demo
          </motion.span>

          <motion.h2 variants={popItem}>
            <GlowText text="AI Powered" color="0, 200, 83" />{" "}
            <GlowText text="Sanitation Scan" color="79, 195, 247" delay={0.15} />
          </motion.h2>

          <motion.p variants={popItem}>
            Upload an image of any location and our AI will detect
            waste, sanitation issues and environmental risks in real time.
          </motion.p>

          <motion.div className="scan-features" variants={staggerGroup(0.1)}>
            <motion.div variants={popItem}><Zap size={16} /> Instant Detection</motion.div>
            <motion.div variants={popItem}><BrainCircuit size={16} /> AI Classification</motion.div>
            <motion.div variants={popItem}><MapPin size={16} /> Geo-tag Ready</motion.div>
          </motion.div>
        </motion.div>

        {/* RIGHT SCAN BOX */}
        <motion.div
          className="scan-right"
          style={{ transformPerspective: 1200 }}
          variants={flipIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className={`scan-box ${scanning ? "active" : ""}`}>
            <div className="scan-grid" />

            {/* LASER */}
            <div className="scan-laser"></div>

            {/* CONTENT */}
            <div className="scan-content">
              <UploadCloud size={42} />

              <h3>
                {scanning
                  ? "Analyzing image..."
                  : scanned
                  ? "Scan complete"
                  : "Drop Image Here"}
              </h3>

              <p>
                {scanning
                  ? "Running AI detection across the frame."
                  : scanned
                  ? "Full detection is available from your dashboard."
                  : "Try a sample scan — no upload required."}
              </p>

              <button className="scan-btn" onClick={handleScan} disabled={scanning}>
                <ScanLine size={18} />
                {scanning ? "Scanning..." : "Start Sample Scan"}
              </button>

              <small>This is a preview of the detection flow</small>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ScanSection;
                                          
