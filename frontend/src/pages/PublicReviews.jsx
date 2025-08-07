import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";
import VideoCard from "../components/VideoCard";

const PublicReviews = () => {
  const [layout, setLayout] = useState("grid");

  // Mock video data
  const videos = [
    {
      id: 1,
      title: "Happy Customer 1",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 2,
      title: "Happy Customer 2",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 3,
      title: "Happy Customer 3",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 4,
      title: "Happy Customer 4",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-blue-600">
            Customer Testimonials
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setLayout("grid")}
              className={`px-4 py-2 rounded-full font-semibold ${
                layout === "grid"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setLayout("carousel")}
              className={`px-4 py-2 rounded-full font-semibold ${
                layout === "carousel"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Carousel
            </button>
            <button
              onClick={() => setLayout("spotlight")}
              className={`px-4 py-2 rounded-full font-semibold ${
                layout === "spotlight"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Spotlight
            </button>
          </div>
        </div>

        {layout === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
        {layout === "carousel" && (
          <div className="overflow-x-scroll flex space-x-6 pb-4">
            {videos.map((video) => (
              <div key={video.id} className="min-w-[300px] max-w-[300px]">
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
        {layout === "spotlight" && (
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Featured Testimonial
            </h3>
            <VideoCard video={videos[0]} />
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/record"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors"
          >
            Leave Your Own Review!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicReviews;
