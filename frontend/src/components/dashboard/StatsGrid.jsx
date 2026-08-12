import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Award, BrainCircuit, Leaf } from "lucide-react";

import { getMyReports } from "../../services/reportService";

function StatsGrid() {
  const [reportCount, setReportCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await getMyReports();
        if (!cancelled) setReportCount(data.count ?? data.reports?.length ?? 0);
      } catch {
        // Leave it as the placeholder dash if the request fails —
        // never show a fabricated number.
        if (!cancelled) setReportCount(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      icon: <FileText size={26} />,
      value: reportCount === null ? "\u2014" : String(reportCount),
      label: "Reports Submitted",
    },
    {
      icon: <Award size={26} />,
      value: "\u2014",
      label: "Community Score",
    },
    {
      icon: <BrainCircuit size={26} />,
      value: "AI-Reviewed",
      label: "Report Analysis",
    },
    {
      icon: <Leaf size={26} />,
      value: "\u2014",
      label: "CO\u2082 Saved",
    },
  ];

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
      
