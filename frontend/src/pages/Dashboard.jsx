import DashboardHero from "../components/dashboard/DashboardHero";
import StatsGrid from "../components/dashboard/StatsGrid";
import QuickActions from "../components/dashboard/QuickActions";

import "../styles/dashboard.css";

function Dashboard() {
  return (
    <main className="dashboard-page">
      <DashboardHero />
      <StatsGrid />
      <QuickActions />
    </main>
  );
}

export default Dashboard;
