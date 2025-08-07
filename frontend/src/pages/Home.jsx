import { Link } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";
import { ChartBarIcon, CogIcon, PhotoIcon, PlayIcon } from "@heroicons/react/16/solid";
import FeatureCard from "../components/UI/FeatureCard";

const Home = () => {
  return (
    <div className="container mx-auto">
      <Navbar />
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">TrueTestify</h1>
        <p className="text-xl text-gray-700 mb-6 font-medium">
          The video-only platform for building trust and emotional impact with customer testimonials.
        </p>
        <p className="max-w-3xl mx-auto text-lg text-gray-500 mb-8">
          TrueTestify is video-only by design — because faces build trust more than stars and text ever could.
        </p>
        <Link to="/record" className="inline-block px-8 py-4 bg-orange-500 text-white text-xl font-bold rounded-full hover:bg-orange-600 transition-colors shadow-lg">
          Leave a Review
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureCard 
          title="Video Review Collection"
          description="Capture authentic customer stories directly in-browser or on mobile, with a simple, 60-second limit."
          icon={<PlayIcon />}
        />
        <FeatureCard 
          title="Public Review Page"
          description="Showcase your best testimonials on a dedicated, branded page to impress potential customers."
          icon={<PhotoIcon />}
        />
        <FeatureCard 
          title="Embeddable Widgets"
          description="Easily add your video testimonials to any website with auto-generated grid, carousel, or floating bubble widgets."
          icon={<CogIcon />}
        />
        <FeatureCard 
          title="Powerful Moderation"
          description="Approve, reject, and reorder reviews from your dashboard to maintain quality control."
          icon={<ChartBarIcon />}
        />
      </div>
    </div>
  );
};

export default Home