import {  useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Home from "./pages/Home";
import RecordReview from "./pages/RecordReview";
import PublicReviews from "./pages/PublicReviews";
import PublicLayout from "./components/UI/PublicLayout";
import DashboardLayout from "./components/UI/DashboardLayout";
import AdminSettings from "./components/Dashboard/AdminSettings";
import Moderation from "./components/Dashboard/Moderation";
import Analytics from "./components/Dashboard/Analytics";
import ManageSubscription from "./pages/ManageSubscrption";
import Pricing from "./components/Dashboard/Pricing";
import UserProtectedRoute from "./components/UI/UserProtectedRoute";
import AdminProtectedRoute from "./components/UI/AdminProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Toaster position="center-top" reverseOrder={false} />

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

      {/* Main Content Area */}

      <div className={`md:ml-0 p-4 md:p-0`}>
        <>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="record" element={ <UserProtectedRoute><RecordReview /></UserProtectedRoute> } />
              <Route path="/:businessName" element={<PublicReviews />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </Route>
            <Route
              path="/dashboard"
              element={
                <AdminProtectedRoute>
                  <DashboardLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Moderation />} />
              <Route path="moderation" element={<Moderation />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="billing" element={<ManageSubscription />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </>
      </div>
    </div>
  );
};

export default App;
