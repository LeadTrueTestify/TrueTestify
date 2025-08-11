import { useContext, useState } from "react";
import { Link, Route, Router, Routes } from "react-router-dom";
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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Features from "./components/UI/Features";
import WidgetSettings from "./components/Dashboard/WidgetSettings";
import Footer from "./components/Shared/Footer";
import FloatingReviewWidget from "./components/Dashboard/FloatingReviewWidget";
import Contact from "./components/Shared/Contact";
import NotFound from "./components/Shared/NotFound";
import { AuthContext } from "./context/AuthContext";
import Account from "./components/Shared/Account";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import Navbar from "./components/Shared/Navbar";
import Integrations from "./components/Shared/Integrations";
import Support from "./components/Shared/Support";
import TermsOfService from "./components/Shared/TermsOfService";
import PrivacyPolicy from "./components/Shared/PrivacyPolicy";
import Blog from "./components/Shared/Blog";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <div className="min-h-screen flex flex-col font-sans bg-gray-50">
        <Toaster position="top-center" reverseOrder={false} />
        {/* Navigation is a full-width header */}
        <Navbar />

        {/* The main content area with a max-width and padding */}
        <main
          className={`flex-1 w-full ${
            user ? "" : "max-w-7xl mx-auto p-4 mt-24 pb-32"
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/public-reviews/:businessName"
              element={<PublicReviews />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/record/:businessName"
              element={
                <UserProtectedRoute>
                  <RecordReview />
                </UserProtectedRoute>
              }
            />
            <Route
              path="/record"
              element={
                <UserProtectedRoute>
                  <RecordReview />
                </UserProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <UserProtectedRoute>
                  <Account />
                </UserProtectedRoute>
              }
            />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/support" element={<Support />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/integrations" element={<Integrations />} />
            {/* Dashboard routes for admins */}
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
              <Route path="widget-settings" element={<WidgetSettings />} />
              <Route
                path="manage-subscription"
                element={<ManageSubscription />}
              />
              <Route path="admin-settings" element={<AdminSettings />} />
            </Route>
            {/* A catch-all route for 404 errors */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* The new Footer component */}
        <Footer />
        <FloatingReviewWidget />
      </div>
    </>
  );
}

export default App;
