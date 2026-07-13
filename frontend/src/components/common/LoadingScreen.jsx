import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Leaf, TreeDeciduous, Globe } from "lucide-react";

const STAGES = ["seed", "rain", "sprout", "tree", "logo", "done"];
const STAGE_DURATIONS = [500, 900, 900, 900, 700]; // ms per stage before advancing

function LoadingScreen() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= STAGES.length - 1) return undefined;

    const t = setTimeout(() => {
      setStageIndex((i) => i + 1);
    }, STAGE_DURATIONS[stageIndex]);

    return () => clearTimeout(t);
  }, [stageIndex]);

  const stage = STAGES[stageIndex];
  const visible = stage !== "done";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="ce-loader"
          exit={{ opacity: 0, filter: "blur(18px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ce-loader-rain">
            {stage === "rain" &&
              [...Array(40)].map((_, i) => (
                <span
                  key={i}
                  className="ce-raindrop"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.6}s`,
                    animationDuration: `${0.5 + Math.random() * 0.4}s`,
                  }}
                />
              ))}
          </div>

          <div className="ce-loader-stage">
            <AnimatePresence mode="wait">
              {(stage === "seed" || stage === "rain") && (
                <motion.div
                  key="seed"
                  className="ce-loader-seed"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Sprout size={72} strokeWidth={1.4} />
                </motion.div>
              )}

              {stage === "sprout" && (
                <motion.div
                  key="sprout"
                  className="ce-loader-sprout"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Leaf size={72} strokeWidth={1.4} />
                </motion.div>
              )}

              {stage === "tree" && (
                <motion.div
                  key="tree"
                  className="ce-loader-tree"
                  initial={{ scale: 0.3, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <TreeDeciduous size={80} strokeWidth={1.3} />
                </motion.div>
              )}

              {stage === "logo" && (
                <motion.div
                  key="logo"
                  className="ce-loader-logo"
                  initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <Globe size={44} className="ce-loader-logo-mark" strokeWidth={1.6} />
                  <span className="ce-loader-logo-text">CivicClean AI</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="ce-loader-ground" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
          
