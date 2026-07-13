import { motion } from "framer-motion";
import { Users, Trophy, Leaf, Recycle, Sparkles } from "lucide-react";

import "../styles/community.css";

function Community() {
  const cards = [
    {
      icon: <Users size={34} />,
      title: "Active Members",
      value: "\u2014",
    },
    {
      icon: <Recycle size={34} />,
      title: "Reports Submitted",
      value: "\u2014",
    },
    {
      icon: <Leaf size={34} />,
      title: "Areas Cleaned",
      value: "\u2014",
    },
    {
      icon: <Trophy size={34} />,
      title: "Challenges Won",
      value: "\u2014",
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
        <div className="feed-item"><Leaf size={16} /> Rahul reported plastic waste in Gomti Nagar.</div>
        <div className="feed-item"><Sparkles size={16} /> Clean-up drive completed in Hazratganj.</div>
        <div className="feed-item"><Recycle size={16} /> 45 kg recyclable waste collected today.</div>
        <div className="feed-item"><Trophy size={16} /> Lucknow reached Community Level 8.</div>
      </section>
    </main>
  );
}

export default Community;
