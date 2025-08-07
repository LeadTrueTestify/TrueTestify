import { ChartBarIcon, CogIcon, CreditCardIcon, HomeIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { Link } from "react-router-dom";
import NavLink from "../NavLink";

const Sidebar = ({ setIsSidebarOpen }) => {
  return (
    <div className="w-64 bg-slate-800 text-white h-full p-4 flex flex-col rounded-r-2xl shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-2xl font-bold text-white" onClick={() => setIsSidebarOpen(false)}>
          Dashboard
        </Link>
        <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <NavLink to="/dashboard/moderation" icon={<PhotoIcon className="h-5 w-5" />} label="Moderation" onClick={() => setIsSidebarOpen(false)} />
          </li>
          <li className="mb-2">
            <NavLink to="/dashboard/analytics" icon={<ChartBarIcon className="h-5 w-5" />} label="Analytics" onClick={() => setIsSidebarOpen(false)} />
          </li>
          <li className="mb-2">
            <NavLink to="/dashboard/billing" icon={<CreditCardIcon className="h-5 w-5" />} label="Billing" onClick={() => setIsSidebarOpen(false)} />
          </li>
          <li className="mb-2">
            <NavLink to="/dashboard/settings" icon={<CogIcon className="h-5 w-5" />} label="Settings" onClick={() => setIsSidebarOpen(false)} />
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-700">
        <Link to="/" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
          <HomeIcon className="h-5 w-5 mr-3" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;