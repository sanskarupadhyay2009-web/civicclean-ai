import { useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PageTransition
 * ------------------
 * Wraps the router's <Outlet /> so every route change gets a soft
 * fade + blur + rise instead of an abrupt hard cut — small, but it's
 * the difference between "a website" and "a product".
 */
function PageTransition() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;

