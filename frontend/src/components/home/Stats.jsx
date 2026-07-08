import { motion } from "framer-motion";
import {
  Activity,
  MapPinned,
  Brain,
  Users
} from "lucide-react";

const stats = [
  {
    icon: <Activity size={32} />,
    value: "18K+",
    title: "Reports Processed"
  },
  {
    icon: <Brain size={32} />,
    value: "98.7%",
    title: "AI Accuracy"
  },
  {
    icon: <MapPinned size={32} />,
    value: "240+",
    title: "Communities"
  },
  {
    icon: <Users size={32} />,
    value: "1M+",
    title: "Citizens Impacted"
  }
];

function Stats() {

  return (

    <section className="stats-section">

      <div className="stats-header">

        <span>LIVE IMPACT</span>

        <h2>

          Numbers That Matter

        </h2>

        <p>

          CivicClean AI is helping citizens and municipalities
          create cleaner and smarter communities through
          Artificial Intelligence.

        </p>

      </div>

      <div className="stats-grid">

        {stats.map((item, index) => (

          <motion.div
            key={index}
            className="stats-card"
            initial={{
              opacity: 0,
              scale: .85
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: .6,
              delay: index * .1
            }}
            viewport={{
              once: true
            }}
          >

            <div className="stats-icon">

              {item.icon}

            </div>

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