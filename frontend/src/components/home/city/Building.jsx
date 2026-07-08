import { motion } from "framer-motion";

const buildings = [
  { left: "8%", height: 90, delay: 0.1 },
  { left: "18%", height: 150, delay: 0.3 },
  { left: "30%", height: 120, delay: 0.5 },
  { left: "42%", height: 200, delay: 0.2 },
  { left: "54%", height: 170, delay: 0.6 },
  { left: "66%", height: 230, delay: 0.4 },
  { left: "78%", height: 140, delay: 0.7 },
  { left: "88%", height: 100, delay: 0.9 },
];

function Buildings() {
  return (
    <div className="city-buildings">

      {buildings.map((building, index) => (

        <motion.div
          key={index}
          className="building"
          style={{
            left: building.left,
            height: building.height,
          }}
          initial={{
            opacity: 0,
            y: 50,
            scaleY: 0.3,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scaleY: 1,
          }}
          transition={{
            duration: 0.8,
            delay: building.delay,
          }}
        >

          {/* Roof */}

          <div className="building-top"></div>

          {/* Windows */}

          <div className="building-windows">

            {Array.from({
              length: Math.floor(building.height / 18),
            }).map((_, row) => (

              <div
                className="window-row"
                key={row}
              >

                {Array.from({
                  length: 3,
                }).map((_, col) => (

                  <motion.span
                    key={col}
                    className="window"
                    animate={{
                      opacity: [0.25, 1, 0.25],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      delay:
                        row * 0.15 +
                        col * 0.1,
                    }}
                  />

                ))}

              </div>

            ))}

          </div>

          {/* AI Beacon */}

          <motion.div
            className="building-beacon"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [1, 0.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: index * 0.2,
            }}
          />

        </motion.div>

      ))}

      {/* Data Links */}

      <svg
        className="city-links"
        viewBox="0 0 1000 350"
        preserveAspectRatio="none"
      >

        <motion.path
          d="M120 250 C240 120 360 180 500 120 S760 180 900 80"
          fill="none"
          stroke="rgba(16,185,129,.35)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />

        <motion.path
          d="M160 210 C320 90 520 240 760 130"
          fill="none"
          stroke="rgba(52,211,153,.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{
            pathLength: 0,
          }}
          animate={{
            pathLength: 1,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />

      </svg>

    </div>
  );
}

export default Buildings;