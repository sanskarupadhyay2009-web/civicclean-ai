import { motion } from "framer-motion";
import { UploadCloud, ScanLine } from "lucide-react";
import { useState } from "react";

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
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >

        <h2>
          AI Powered <span>Sanitation Scan</span>
        </h2>

        <p>
          Upload an image of any location and our AI will detect
          waste, sanitation issues and environmental risks in real time.
        </p>

        <div className="scan-features">

          <div>⚡ Instant Detection</div>
          <div>🧠 AI Classification</div>
          <div>📍 Geo-tag Ready</div>

        </div>

      </motion.div>

      {/* RIGHT SCAN BOX */}
      <motion.div
        className="scan-right"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
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
