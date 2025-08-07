import { useState } from "react";
import { Link, Route, Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Sidebar from "./components/Shared/Sidebar";
import Home from "./pages/Home";
import RecordReview from "./pages/RecordReview";
import PublicReviews from "./pages/PublicReviews";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Mobile Navigation Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          TrueTestify
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-600"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for Dashboard */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:fixed h-full md:translate-x-0 transition-transform duration-200 ease-in-out md:w-64 z-40`}
      >
        <Sidebar setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="md:ml-65 p-4 md:p-4">
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/record" element={<RecordReview />} />
            <Route path="/yourbusiness" element={<PublicReviews />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </>
      </div>
    </div>
  );
};

export default App;
