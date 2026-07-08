import { motion } from "framer-motion";
import { Search, Filter, Clock } from "lucide-react";

import "../styles/reports.css";

const reports = [
  {
    id: 1,
    type: "Plastic Waste",
    location: "Hazratganj",
    status: "Pending",
    date: "Today",
  },
  {
    id: 2,
    type: "Garbage Dump",
    location: "Aliganj",
    status: "Resolved",
    date: "Yesterday",
  },
  {
    id: 3,
    type: "Electronic Waste",
    location: "Gomti Nagar",
    status: "In Progress",
    date: "2 days ago",
  },
];

function Reports() {
  return (
    <main className="reports-page">
      <motion.div
        className="reports-header"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>My Reports</h1>

        <p>Track every environmental report you've submitted.</p>
      </motion.div>

      <div className="reports-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input placeholder="Search reports..." />
        </div>

        <button>
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="reports-list">
        {reports.map((report) => (
          <motion.div key={report.id} className="report-card" whileHover={{ y: -5 }}>
            <div>
              <h3>{report.type}</h3>
              <span>{report.location}</span>
            </div>

            <div className="report-status">{report.status}</div>

            <div className="report-date">
              <Clock size={16} />
              {report.date}
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export default Reports;
