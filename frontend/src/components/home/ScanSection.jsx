import { motion } from "framer-motion";
import { UploadCloud, ScanLine } from "lucide-react";
import { useState } from "react";

import { staggerGroup, popItem, flipIn } from "../../utils/motionVariants";

function ScanSection() {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
    }, 2500);
  };

  return (
    <section className="scan-section">

      {/* LEFT INFO */}
      <motion.div
        className="scan-left"
        variants={staggerGroup(0.14)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >

        <motion.h2 variants={popItem}>
          AI Powered <span>Sanitation Scan</span>
        </motion.h2>

        <motion.p variants={popItem}>
          Upload an image of any location and our AI will detect
          waste, sanitation issues and environmental risks in real time.
        </motion.p>

        <motion.div className="scan-features" variants={staggerGroup(0.1)}>

          <motion.div variants={popItem}>⚡ Instant Detection</motion.div>
          <motion.div variants={popItem}>🧠 AI Classification</motion.div>
          <motion.div variants={popItem}>📍 Geo-tag Ready</motion.div>

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
          {/* LASER */}
          <div className="scan-laser"></div>

          {/* CONTENT */}
          <div className="scan-content">
            <UploadCloud size={42} />

            <h3>{scanning ? "Login/Register to scan..." : "Drop Image Here"}</h3>

            <p>{scanning ? "AI is available in report area..." : "this is a showpiece"}</p>

            <button className="scan-btn" onClick={handleScan}>
              <ScanLine size={18} />
              {scanning ? "Scanning..." : "Start Scan"}
            </button>
          </div>
        </div>

      </motion.div>

    </section>
  );
}

export default ScanSection;
        
