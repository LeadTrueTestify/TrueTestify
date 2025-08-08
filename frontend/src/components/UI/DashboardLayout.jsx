import { Link, Outlet } from "react-router-dom";
import Sidebar from "../Shared/Sidebar";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Navbar from "../Shared/Navbar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
    <Navbar/>
    <div className="flex min-h-screen">
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm w-full">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">Dashboard</Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600">
          {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>
      
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out md:w-64 z-40 flex-shrink-0 md:flex`}>
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-grow p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default DashboardLayout;