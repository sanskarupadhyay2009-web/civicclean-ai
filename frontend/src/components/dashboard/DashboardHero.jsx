import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

function DashboardHero() {
  const { user } = useAuth();

  return (
    <motion.section
      className="dashboard-hero"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <h1>
          Welcome back,
          <span className="gradient-text"> {user?.name}</span> 👋
        </h1>

        <p>
          Together we're making cities cleaner, smarter and greener.
        </p>
      </div>
    </motion.section>
  );
}

export default DashboardHero;
