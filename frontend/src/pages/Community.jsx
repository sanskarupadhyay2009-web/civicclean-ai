import { motion } from "framer-motion";
import { Users, Trophy, Leaf, Recycle } from "lucide-react";

import "../styles/community.css";

function Community() {
  const cards = [
    {
      icon: <Users size={34} />,
      title: "Active Members",
      value: "2,486",
    },
    {
      icon: <Recycle size={34} />,
      title: "Reports Submitted",
      value: "18,241",
    },
    {
      icon: <Leaf size={34} />,
      title: "Areas Cleaned",
      value: "312",
    },
    {
      icon: <Trophy size={34} />,
      title: "Challenges Won",
      value: "48",
    },
  ];

  return (
    <main className="community-page">
      <motion.div
        className="community-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Community</h1>
        <p>Join citizens working together to build cleaner cities.</p>
      </motion.div>

      <section className="community-grid">
        {cards.map((card, index) => (
          <motion.div key={index} className="community-card" whileHover={{ y: -8 }}>
            {card.icon}
            <h2>{card.value}</h2>
            <span>{card.title}</span>
          </motion.div>
        ))}
      </section>

      <section className="community-feed">
        <h2>Recent Community Activity</h2>
        <div className="feed-item">🌱 Rahul reported plastic waste in Gomti Nagar.</div>
        <div className="feed-item">🧹 Clean-up drive completed in Hazratganj.</div>
        <div className="feed-item">♻️ 45 kg recyclable waste collected today.</div>
        <div className="feed-item">🏆 Lucknow reached Community Level 8.</div>
      </section>
    </main>
  );
}

export default Community;
