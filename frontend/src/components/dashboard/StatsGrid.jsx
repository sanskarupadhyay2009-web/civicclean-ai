import { motion } from "framer-motion";
import { FileText, Award, BrainCircuit, Leaf } from "lucide-react";

const stats = [
  {
    icon: <FileText size={26} />,
    value: "18",
    label: "Reports Submitted",
  },
  {
    icon: <Award size={26} />,
    value: "520",
    label: "Community Score",
  },
  {
    icon: <BrainCircuit size={26} />,
    value: "98.7%",
    label: "AI Accuracy",
  },
  {
    icon: <Leaf size={26} />,
    value: "1.2T",
    label: "CO₂ Saved",
  },
];

function StatsGrid() {
  return (
    <section className="stats-grid">
      {stats.map((item, index) => (
        <motion.div
          key={index}
          className="stat-box"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: index * 0.12,
            duration: 0.5,
          }}
        >
          <div className="stat-icon">{item.icon}</div>

          <h2>{item.value}</h2>

          <span>{item.label}</span>
        </motion.div>
      ))}
    </section>
  );
}

export default StatsGrid;
