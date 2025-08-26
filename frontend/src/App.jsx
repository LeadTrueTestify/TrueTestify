import { useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Home from "./components/Shared/Home/Home";
import RecordReview from "./pages/RecordReview";
import PublicReviews from "./pages/PublicReviews";
import DashboardLayout from "./components/UI/DashboardLayout";
import AdminSettings from "./components/Dashboard/AdminSettings";
import Moderation from "./components/Dashboard/Moderation";
import Analytics from "./components/Dashboard/Analytics";
import ManageSubscription from "./pages/ManageSubscrption";
import Pricing from "./components/Shared/Pricing";
import Billing from "./components/Dashboard/Billing";
import UserProtectedRoute from "./components/UI/UserProtectedRoute";
import AdminProtectedRoute from "./components/UI/AdminProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Features from "./components/Shared/Features";
import WidgetSettings from "./components/Dashboard/WidgetSettings";
import Footer from "./components/Shared/Footer";
import FloatingReviewWidget from "./components/Dashboard/FloatingReviewWidget";
import Contact from "./components/Shared/Contact";
import NotFound from "./components/Shared/NotFound";
import Account from "./components/Shared/Account";
import Navbar from "./components/Shared/Navbar";
import Integrations from "./components/Shared/Integrations";
import Support from "./components/Shared/Support";
import TermsOfService from "./components/Shared/TermsOfService";
import PrivacyPolicy from "./components/Shared/PrivacyPolicy";
import Blog from "./components/Shared/Blog";
import Testimonial from "./pages/Testimonial";
import About from "./components/Shared/About";
import VideoReviews from "./components/Shared/Services/VideoReviews";
import AudioReviews from "./components/Shared/Services/AudioReviews";
import TextReviews from "./components/Shared/Services/TextReviews";
import QRCodeCollection from "./components/Shared/Services/QRCodeCollection";
import CarouselWidget from "./components/Shared/Widgets/CarouselWidget";
import GridWidget from "./components/Shared/Widgets/GridWidget";
import SpotlightWidget from "./components/Shared/Widgets/SpotlightWidget";
import WallWidget from "./components/Shared/Widgets/WallWidget";
import GoogleEmbed from "./components/Shared/GoogleEmbed";
import Document from "./components/Shared/Document";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user, tenant } = useContext(AuthContext);
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <>
      <div className="min-h-screen flex flex-col font-sans bg-gray-50">
        <Toaster position="top-center" reverseOrder={false} />
        {!isDashboardRoute && <Navbar />}

        {/* The main content area with a max-width and padding */}
        <main
          className={`flex-1 w-full ${
            !isDashboardRoute ? "max-w-7xl mx-auto p-4 mt-5 pb-32" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/services/video-reviews" element={<VideoReviews />} />
            <Route path="/services/audio-reviews" element={<AudioReviews />} />
            <Route path="/services/text-reviews" element={<TextReviews />} />
            <Route path="/widgets/carousel" element={<CarouselWidget />} />
            <Route path="/widgets/grid" element={<GridWidget />} />
            <Route path="/widgets/spotlight" element={<SpotlightWidget />} />
            <Route path="/widgets/wall" element={<WallWidget />} />
            <Route path="/docs" element={<Document />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reviews/google-embed" element={<GoogleEmbed />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/record/:businessName" element={<RecordReview />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/support" element={<Support />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route
              path="/services/qr-collection"
              element={<QRCodeCollection />}
            />
            <Route
              path="/:businessName"
              element={<PublicReviews />}
            />

            <Route
              path="/account"
              element={
                <UserProtectedRoute>
                  <Account userInfo={user} business={tenant} />
                </UserProtectedRoute>
              }
            />
            {/* Dashboard routes for admins */}
            <Route
              path="/dashboard"
              element={
                <AdminProtectedRoute>
                  <DashboardLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Moderation userInfo={user} business={tenant} />} />
              <Route path="moderation" element={<Moderation />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="widget-settings" element={<WidgetSettings business={tenant} />} />
              <Route path="billing" element={<Billing />} />
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
        {!isDashboardRoute && <Footer />}
        {!isDashboardRoute && <FloatingReviewWidget />}
      </div>
    </>
  );
}

export default App;
