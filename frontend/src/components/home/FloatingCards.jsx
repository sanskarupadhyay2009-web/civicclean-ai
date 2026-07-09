import { motion } from "framer-motion";
import { Brain, FileText, Leaf } from "lucide-react";

const cards = [
  {
    icon: Brain,
    title: "AI Detection",
    subtitle: "Real-time Analysis",
    pos: { top: "6%", right: "-2%" },
    delay: 0,
    floatY: [-8, 8],
  },
  {
    icon: FileText,
    title: "Smart Reporting",
    subtitle: "Easy & Instant",
    pos: { top: "38%", left: "-2%" },
    delay: 0.5,
    floatY: [-6, 10],
  },
  {
    icon: Leaf,
    title: "Cleaner Cities",
    subtitle: "Better Future",
    pos: { bottom: "22%", right: "0%" },
    delay: 1,
    floatY: [-10, 6],
  },
];

function FloatingCards() {
  return (
    <div className="floating-cards">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            className="floating-badge"
            style={card.pos}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              y: card.floatY,
              scale: 1,
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.8 + card.delay },
              scale: { duration: 0.6, delay: 0.8 + card.delay },
              y: {
                duration: 5 + i,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: card.delay,
              },
            }}
          >
            {/* Connector dot */}
            <motion.span
              className="badge-connector"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="floating-badge-icon">
              <Icon size={18} />
            </div>

            <div className="floating-badge-text">
              <strong>{card.title}</strong>
              <span>{card.subtitle}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default FloatingCards;
            
