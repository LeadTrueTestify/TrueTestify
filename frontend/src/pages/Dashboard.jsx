import { Route, Routes } from "react-router-dom";
import Moderation from "../components/Dashboard/Moderation";
import Analytics from "../components/Dashboard/Analytics";
import Billing from "../components/Dashboard/Billing";
import Settings from "../components/Dashboard/Settings";

const Dashboard = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <Routes>
        <Route path="/" element={<Moderation />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
