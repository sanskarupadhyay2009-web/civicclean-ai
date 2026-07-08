import { motion } from "framer-motion";

function CityPlatform() {
  return (
    <motion.div
      className="city-platform-wrapper"
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 1,
        delay: 0.3,
        ease: "easeOut",
      }}
    >
      {/* Shadow */}

      <div className="platform-shadow"></div>

      {/* Base */}

      <div className="platform-base">

        {/* Grid */}

        <div className="platform-grid">

          {Array.from({ length: 9 }).map((_, row) =>
            Array.from({ length: 9 }).map((_, col) => (
              <motion.span
                key={`${row}-${col}`}
                className="grid-node"
                animate={{
                  opacity: [0.25, 1, 0.25],
                  scale: [1, 1.25, 1],
                }}
                transition={{
                  duration: 3 + ((row + col) % 3),
                  repeat: Infinity,
                  delay: (row + col) * 0.08,
                }}
              />
            ))
          )}

        </div>

        {/* Outer Glow */}

        <div className="platform-glow"></div>

        {/* Edge Light */}

        <div className="platform-border"></div>

      </div>

      {/* Energy Ring */}

      <motion.div
        className="energy-ring"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pulse */}

      <motion.div
        className="platform-pulse"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.8, 0.35],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
        }}
      />

    </motion.div>
  );
}

export default CityPlatform;