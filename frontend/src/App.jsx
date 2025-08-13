import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import Billing from "./components/Dashboard/Billing";
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
import Navbar from "./components/Shared/Navbar";
import Integrations from "./components/Shared/Integrations";
import Support from "./components/Shared/Support";
import TermsOfService from "./components/Shared/TermsOfService";
import PrivacyPolicy from "./components/Shared/PrivacyPolicy";
import Blog from "./components/Shared/Blog";
import Testimonial from "./pages/Testimonial";
import About from "./components/Shared/About";
import { MoonIcon, SunIcon } from "@heroicons/react/16/solid";
import VideoReviews from "./components/Shared/Services/VideoReviews";
import AudioReviews from "./components/Shared/Services/AudioReviews";
import TextReviews from "./components/Shared/Services/TextReviews";
import QRCodeCollection from "./components/Shared/Services/QRCodeCollection";
import CarouselWidget from "./components/Shared/Widgets/CarouselWidget";
import GridWidget from "./components/Shared/Widgets/GridWidget";
import SpotlightWidget from "./components/Shared/Widgets/SpotlightWidget";
import WallWidget from "./components/Shared/Widgets/WallWidget";

function App() {
    const {getInitialData} = useContext(AuthContext);
  const [widgetConfig, setWidgetConfig] = useState(getInitialData('widgetConfig', {
    layout: 'carousel',
    theme: 'light',
    autoplay: true,
    accentColor: '#ef7c00', // TrueTestify orange
  }));

  const handleConfigChange = (key, value) => {
    const newConfig = { ...widgetConfig, [key]: value };
    localStorage.setItem('widgetConfig', JSON.stringify(newConfig));
    setWidgetConfig(newConfig);
    toast.success('Widget settings updated!');
  };

  const layouts = [
    { name: 'Carousel', value: 'carousel' },
    { name: 'Grid', value: 'grid' },
    { name: 'Wall', value: 'wall' },
    { name: 'Spotlight', value: 'spotlight' },
  ];

  const themes = [
    { name: 'Light', value: 'light', icon: <SunIcon className="h-5 w-5" /> },
    { name: 'Dark', value: 'dark', icon: <MoonIcon className="h-5 w-5" /> },
  ];

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
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
            <Route path="/services/qr-collection" element={<QRCodeCollection />} />
            <Route path="/widgets/carousel" element={<CarouselWidget />} />
            <Route path="/widgets/grid" element={<GridWidget />} />
            <Route path="/widgets/spotlight" element={<SpotlightWidget />} />
            <Route path="/widgets/wall" element={<WallWidget />} />
            <Route path="/docs" element={<div className="max-w-4xl mx-auto py-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Documentation</h1>
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Getting Started</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to TrueTestify documentation. Here you'll find everything you need to get started with collecting and managing customer testimonials.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Setup</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
                  <li>Sign up for an account and choose your plan</li>
                  <li>Configure your widget settings in the dashboard</li>
                  <li>Embed the widget on your website</li>
                  <li>Start collecting customer reviews</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Widget Integration</h3>
                <p className="text-gray-600 mb-4">
                  Copy the provided JavaScript code from your dashboard and paste it into your website's HTML.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">QR Code Collection</h3>
                <p className="text-gray-600 mb-4">
                  Generate QR codes for offline review collection. Customers can scan the code to leave reviews directly.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Need Help?</h3>
                <p className="text-gray-600">
                  If you need additional support, please visit our <a href="/support" className="text-orange-500 hover:text-orange-600">Support page</a> or contact us directly.
                </p>
              </div>
            </div>} />
             <Route path="/testimonial" element={<Testimonial />} />
            <Route
              path="/public-reviews/:businessName"
              element={<PublicReviews isPreview={true} layout={widgetConfig.layout} />}
            />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/record/:businessName" element={<RecordReview />} />
            <Route path="/record" element={<RecordReview />} />
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
