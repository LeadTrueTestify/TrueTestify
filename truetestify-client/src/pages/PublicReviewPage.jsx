import { useContext } from "react";
import EmbedWidget from "../features/widgets/EmbedWidget.jsx";
import video from "../mock/test-video.webm";
import audio from "../mock/test.mp3";
import { UserContext } from "../context/UserContex.jsx";

const mockReviews = [
  {
    id: "1",
    type: "video",
    content: video,
    author: "Sarah A.",
    approved: true,
    date: "2025-08-05",
  },
  {
    id: "2",
    type: "written",
    content: "Loved it! Easy to use and excellent support.",
    author: "Ali R.",
    approved: true,
    date: "2025-08-04",
  },
  {
    id: "3",
    type: "audio",
    content: audio,
    author: "David S.",
    approved: true,
    date: "2025-08-03",
  },
];

const PublicReviewPage = () => {
  const { reviews } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {reviews.filter((a) => a.approved === true) ? (
        <EmbedWidget reviews={reviews} style="light" />
      ) : (
        <div className="text-3xl text-gray-500">no reviews</div>
      )}
    </div>
  );
};

export default PublicReviewPage;
