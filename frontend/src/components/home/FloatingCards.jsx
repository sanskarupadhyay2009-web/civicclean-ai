import { motion } from "framer-motion";
import { Brain, FileText, Leaf } from "lucide-react";

const cards = [
  {
    icon: <Brain size={20} />,
    title: "AI Detection",
    subtitle: "Real-time Analysis",
    className: "card-one",
    delay: 0,
  },
  {
    icon: <FileText size={20} />,
    title: "Smart Reporting",
    subtitle: "Easy & Instant",
    className: "card-two",
    delay: 0.3,
  },
  {
    icon: <Leaf size={20} />,
    title: "Cleaner Cities",
    subtitle: "Better Future",
    className: "card-three",
    delay: 0.6,
  },
];

function FloatingCards() {
  return (
    <div className="floating-cards">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className={`floating-badge ${card.className}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: 1,
            y: [-10, 10, -10],
          }}
          transition={{
            opacity: { duration: 0.6, delay: card.delay },
            y: {
              duration: 5,
              repeat: Infinity,
              delay: card.delay,
              ease: "easeInOut",
            },
          }}
        >
          <div className="floating-badge-icon">{card.icon}</div>

          <div className="floating-badge-text">
            <strong>{card.title}</strong>
            <span>{card.subtitle}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingCards;
