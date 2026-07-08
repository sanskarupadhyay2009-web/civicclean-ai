import { motion } from "framer-motion";

import cityImage from "../../../assets/hero-city.png";
import HeroCraft from "./HeroCraft";

/**
 * HeroCityImage
 * ------------------
 * Uses the actual generated isometric city image as the hero visual,
 * instead of a code-drawn city. A soft ambient glow sits behind it to
 * blend the image into the site's dark theme, and HeroCraft (an
 * animated flying ship) is layered on top so the scene still feels
 * alive even when the page is static.
 */

function HeroCityImage() {
  return (
    <motion.div
      className="hero-city-image-wrap"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
    >
      <div className="hero-city-glow"></div>

      <img
        src={cityImage}
        alt="Futuristic neon isometric city"
        className="hero-city-img"
      />

      <HeroCraft />
    </motion.div>
  );
}

export default HeroCityImage;
