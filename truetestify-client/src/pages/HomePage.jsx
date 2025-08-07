import { Link } from "react-router-dom";
import AudioReviewCard from "../components/AudioReviewCard";
import VideoReviewCard from "../components/VideoReviewCard";
import { mockReviews } from "../mock/reviews";
import PricingPage from "./PricingPage";
import TextReviewCard from "../components/TextReviewCard";
import Widgets from "../features/widgets/Widgets";
import VideoFeatures from "../features/widgets/VideoFeatures";
// import Privacy from "../features/widgets/Privacy";

const HomePage = () => {
  const videos = mockReviews.filter(
    (r) => r.type === "video" && r.status === "approved"
  );
  const audios = mockReviews.filter(
    (r) => r.type === "audio" && r.status === "approved"
  );
  const text = mockReviews.filter(
    (r) => r.type === "text" && r.status === "approved"
  );
  return (
    <div className="">
      <section className="text-center py-16 bg-blue-50">
        <h1 className="text-4xl font-bold text-primary">
          Turn Customers Into Marketers
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-xl mx-auto">
          Collect, showcase, and convert with authentic video and audio reviews.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600"
          >
            Get Started
          </Link>
        </div>
        <div className="flex items-center justify-center py-10 gap-2">
          <span className="flex items-center justify-between py-2 px-2 border border-blue-300 bg-green-300 rounded-2xl">
            Videos
          </span>
          <span className="flex items-center justify-between py-2 px-2 border border-blue-300 bg-orange-400 rounded-2xl">
            Audio
          </span>
          <span className="flex items-center justify-between py-2 px-2 border border-blue-300 bg-blue-300 rounded-2xl">
            Text
          </span>
        </div>
      </section>

      <section className="py-12 ">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Recent Video & Audio Reviews
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 border border-blue-200 bg-blue-50 py-10 px-5">
          {videos.map((r, i) => (
            <VideoReviewCard key={i} {...r} url={r.url}  />
          ))}
          {audios.map((r, i) => (
            <AudioReviewCard key={i} {...r} url={r.audiourl || ""} />
          ))}
          {text.map((r) => (
            <TextReviewCard key={r.id} {...r} content={r.content || ""} />
          ))}
        </div>
      </section>
      <section className="py-0">
        <h2 className="text-2xl font-semibold text-center mb-8">
          <VideoFeatures />
        </h2>
      </section>
      <section className="py-0">
        <h2 className="text-2xl font-semibold text-center mb-8">
          <Widgets />
        </h2>
      </section>
      <section className="py-0 ">
        <h2 className="text-2xl font-semibold text-center mb-8">
          <PricingPage />
        </h2>
      </section>
       {/* <section className="py-0 ">
        <h2 className="text-2xl font-semibold text-center mb-8">
          <Privacy />
        </h2>
      </section> */}
    </div>
  );
};

export default HomePage;
