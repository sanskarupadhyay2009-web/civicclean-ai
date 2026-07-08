import { motion } from "framer-motion";

import CityPlatform from "./CityPlatform";
import Buildings from "./Buildings";
import ScanBeam from "./ScanBeam";

function CityScene() {
  return (
    <motion.div
      className="city-scene"
      initial={{
        opacity: 0,
        scale: 0.92,
        rotateX: -8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateX: 0,
      }}
      transition={{
        duration: 1.2,
        ease: "easeOut",
      }}
    >
      {/* Ambient Glow */}
      <div className="city-glow"></div>

      {/* Emerald Hemisphere */}
      <motion.div
        className="city-sphere"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="sphere-ring ring-one"></div>
        <div className="sphere-ring ring-two"></div>
        <div className="sphere-ring ring-three"></div>

        <div className="sphere-core"></div>
      </motion.div>

      {/* Platform */}

      <CityPlatform />

      {/* Buildings */}

      <Buildings />

      {/* Laser */}

      <ScanBeam />

      {/* Floating Light */}

      <motion.div
        className="city-light light-one"
        animate={{
          y: [-12, 12, -12],
          opacity: [.3, 1, .3],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
      />

      <motion.div
        className="city-light light-two"
        animate={{
          y: [15, -15, 15],
          opacity: [.4, 1, .4],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
      />

      <motion.div
        className="city-light light-three"
        animate={{
          y: [-10, 18, -10],
          opacity: [.5, 1, .5],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
        }}
      />

      {/* Orbital Pulse */}

      <motion.div
        className="city-pulse"
        animate={{
          scale: [1, 1.35, 1],
          opacity: [.4, 0, .4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
}

export default CityScene;