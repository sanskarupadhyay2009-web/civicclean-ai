import { motion } from "framer-motion";

function ScrollIndicator() {
  return (
    <motion.div
      className="scroll-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <span>Scroll to explore</span>
      <div className="scroll-indicator-line" />
    </motion.div>
  );
}

export default ScrollIndicator;
