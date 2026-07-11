import { motion } from "framer-motion";
import {
  Activity,
  MapPinned,
  Brain,
  Users
} from "lucide-react";

import { staggerGroup, popItem, cardPop } from "../../utils/motionVariants";
import ScrambleText from "../common/ScrambleText";
import GlowText from "../common/GlowText";

const stats = [
  {
    icon: <Activity size={32} />,
    value: "Live",
    title: "Reports Tracked in Real Time"
  },
  {
    icon: <Brain size={32} />,
    value: "AI-Powered",
    title: "Every Report Analyzed"
  },
  {
    icon: <MapPinned size={32} />,
    value: "Open",
    title: "To Every Community"
  },
  {
    icon: <Users size={32} />,
    value: "Citizen-Led",
    title: "Built by People Who Care"
  }
];

function Stats() {

  return (

    <section className="stats-section">

      <motion.div
        className="stats-header"
        variants={staggerGroup(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >

        <motion.span variants={popItem}>
          <ScrambleText text="LIVE IMPACT" speed={28} />
        </motion.span>

        <motion.h2 variants={popItem}>

          <GlowText text="What Makes Us Different" />

        </motion.h2>

        <motion.p variants={popItem}>

          CivicClean AI is helping citizens and municipalities
          create cleaner and smarter communities through
          Artificial Intelligence.

        </motion.p>

      </motion.div>

      <div className="stats-grid">

        {stats.map((item, index) => (

          <motion.div
            key={index}
            className="stats-card"
            variants={cardPop(index)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            whileHover={{
              y: -8,
              scale: 1.04,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >

            <motion.div
              className="stats-icon"
              initial={{ scale: 0, rotate: 130 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            >

              {item.icon}

            </motion.div>

            <h3>

              {item.value}

            </h3>

            <p>

              {item.title}

            </p>

          </motion.div>

        ))}

      </div>

    </section>

  );

}

export default Stats;
              
