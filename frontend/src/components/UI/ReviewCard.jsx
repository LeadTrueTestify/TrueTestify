import { MicrophoneIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstanse";
import toast from "react-hot-toast";

// Review card component
const ReviewCard = ({ review, theme }) => {
  const [mediaError, setMediaError] = useState(false);
  const [view,setView] = useState([]);
  
  const handleView = ()=> {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.patch(API_PATHS.ANALYTICS.VIEWS(review?.id));        
        setView(response.data);
        console.log(response);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        toast.error("Could not load reviews.");

      }
    };
    fetchReviews();
  }
  // Destructure and clean up data
  const { authorName = "Anonymous", text, videoUrl, audioUrl, title } = review;

  // Determine media type
  const hasVideo = videoUrl && !mediaError && !text;
  const hasAudio = audioUrl && !mediaError && !text;
  const hasText = text;

  // Theme-specific classes
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const cardBorder = isDark ? "border-gray-700" : "border-gray-200";
  const titleColor = isDark ? "text-gray-100" : "text-gray-800";
  const subtitleColor = isDark ? "text-gray-400" : "text-gray-500";
  const textColor = isDark ? "text-gray-200" : "text-gray-700";
  const textBg = isDark
    ? "bg-gray-700"
    : "bg-gradient-to-br from-orange-50 to-white";
  const mediaPlaceholderBg = isDark ? "bg-gray-700" : "bg-gray-50";
  const mediaPlaceholderText = isDark ? "text-gray-400" : "text-gray-500";
  const mediaIconBg = isDark ? "bg-orange-800" : "bg-orange-100";
  const mediaIconColor = isDark ? "text-orange-300" : "text-orange-500";

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out hover:scale-[1.02] hover:shadow-2xl ${cardBg} ${cardBorder} border`}
    >
      {/* Media Section */}
      <div className="relative">
        {hasVideo && (
          <div className="rounded-t-xl overflow-hidden aspect-video">
            <video
              src={videoUrl?.trim()}
              controls
              className="w-full h-full object-cover"
              onError={() => setMediaError(true)}
            />
          </div>
        )}

        {hasAudio && (
          <div
            className={`p-8 flex flex-col items-center justify-center text-center ${mediaPlaceholderBg}`}
          >
            <div
              className={`p-4 rounded-full transition-all duration-300 ${mediaIconBg} hover:shadow-lg`}
            >
              <MicrophoneIcon className={`h-12 w-12 ${mediaIconColor}`} />
            </div>
            <p className={`mt-4 text-sm font-medium ${mediaPlaceholderText}`}>
              Audio Review
            </p>
            <audio
              onClick={()=> handleView()}
              src={audioUrl?.trim()}
              controls
              className="w-full mt-4"
              onError={() => setMediaError(true)}
            />
          </div>
        )}

        {hasText && (
          <div className={`p-6 md:p-8 ${textBg} `}>
            <p
              className={`text-lg md:text-xl leading-relaxed italic ${textColor}`}
            >
              <span className="text-orange-500 font-extrabold text-2xl pr-1">
                "
              </span>
              {text.trim()}
              <span className="text-orange-500 font-extrabold text-2xl pl-1">
                "
              </span>
            </p>
          </div>
        )}

        {/* Fallback if media fails or no review content */}
        {(!hasVideo && !hasAudio && !hasText) || (mediaError && !hasText) ? (
          <div className={`p-8 text-center rounded-xl ${mediaPlaceholderBg}`}>
            <MicrophoneIcon
              className={`h-10 w-10 ${mediaPlaceholderText} mx-auto`}
            />
            <p className={`mt-2 text-sm font-medium ${mediaPlaceholderText}`}>
              Review content unavailable
            </p>
          </div>
        ) : null}
      </div>

      {/* Title & Author Section */}
      <div className={`p-5 border-t ${cardBorder}`}>
        <h3 className={`text-xl font-bold leading-tight ${titleColor}`}>
          {title || "Untitled Review"}
        </h3>
        <p className={`mt-1 text-sm font-medium ${subtitleColor}`}>
          by <span className="text-orange-500">{authorName}</span>
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;
