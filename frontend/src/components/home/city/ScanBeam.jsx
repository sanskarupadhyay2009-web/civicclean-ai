import { motion } from "framer-motion";

function ScanBeam() {
  return (
    <div className="scan-system">

      {/* Main Laser */}

      <motion.div
        className="scan-beam"
        animate={{
          opacity: [0.25, 0.85, 0.25],
          scaleY: [0.96, 1.04, 0.96],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Vertical Sweep */}

      <motion.div
        className="scan-sweep"
        animate={{
          y: [-170, 170, -170],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Core */}

      <motion.div
        className="scan-core"
        animate={{
          scale: [1, 1.35, 1],
          opacity: [1, .45, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Rings */}

      <motion.div
        className="scan-ring ring-one"
        animate={{
          rotate: 360,
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="scan-ring ring-two"
        animate={{
          rotate: -360,
          scale: [1.1, 1.18, 1.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Detection Pulses */}

      {[...Array(4)].map((_, i) => (

        <motion.div
          key={i}
          className={`scan-pulse pulse-${i + 1}`}
          animate={{
            scale: [0.4, 2.2],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: i * .65,
          }}
        />

      ))}

      {/* Energy Particles */}

      {[...Array(12)].map((_, i) => (

        <motion.span
          key={i}
          className="beam-particle"
          style={{
            left: `${45 + Math.random() * 10}%`,
          }}
          animate={{
            y: [180, -180],
            opacity: [0, 1, 0],
            scale: [.5, 1.2, .5],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: i * .18,
            ease: "linear",
          }}
        />

      ))}

      {/* AI Scanner Head */}

      <motion.div
        className="scanner-head"
        animate={{
          y: [-140, 140, -140],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >

        <div className="scanner-eye"></div>

      </motion.div>

    </div>
  );
}

export default ScanBeam;