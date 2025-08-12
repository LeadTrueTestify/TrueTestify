import { Link } from "react-router-dom";
import {
  CloudArrowUpIcon,
  PencilIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/16/solid";
import Features from "../components/UI/Features";
import Pricing from "../components/Dashboard/Pricing";
import Contact from "../components/Shared/Contact";
import { MOCK_REVIEWS } from "../assets/mockData";
import ReviewCard from "../components/UI/ReviewCard";

const Home = () => {
  const featuredReviews = MOCK_REVIEWS.filter(
    (r) => r.status === "approved" && r.type !== "audio"
  ).slice(0, 3);

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="bg-gray-100 p-16 border-b border-gray-200">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
          Capture Authentic Customer Testimonials.
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
          Effortlessly collect, moderate, and display powerful video, audio, and
          text testimonials that drive trust and sales.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/signup"
            className="px-10 py-4 text-white bg-orange-500 font-bold tracking-wide transition-colors hover:bg-orange-600"
          >
            Get Started - It's Free
          </Link>
          <Link
            to="/features"
            className="px-10 py-4 text-gray-800 font-bold border-2 border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="p-16 bg-white border border-gray-200 mt-5">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-12 tracking-tight">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-gray-100 text-orange-500 p-6 mb-4 border border-gray-200">
              <CloudArrowUpIcon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Collect with Ease
            </h3>
            <p className="text-gray-600">
              Send a simple link to your customers and let them record their
              video, audio, or text review in seconds.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-gray-100 text-orange-500 p-6 mb-4 border border-gray-200">
              <PencilIcon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Moderate with Control
            </h3>
            <p className="text-gray-600">
              Approve or reject submissions from your dashboard before they go
              live on your website.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-gray-100 text-orange-500 p-6 mb-4 border border-gray-200">
              <PuzzlePieceIcon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Display Beautifully
            </h3>
            <p className="text-gray-600">
              Embed customizable widgets on your site to showcase your authentic
              testimonials.
            </p>
          </div>
        </div>
      </div>

      {/* NEW: Featured Testimonials Section */}
      {featuredReviews.length > 0 && (
        <div className="p-16 bg-gray-100 border-t border-gray-200 mt-5">
          <h2 className="text-5xl font-extrabold text-gray-800 mb-15 tracking-tight">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
            {featuredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} isPreview={true} />
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/testimonial"
              className="inline-block px-10 py-4 text-white bg-blue-600 font-bold tracking-wide transition-colors hover:bg-blue-700"
            >
              View All Testimonials
            </Link>
          </div>
        </div>
      )}
      <Features />
      <Pricing />
      <Contact />
    </div>
  );
};

export default Home;
