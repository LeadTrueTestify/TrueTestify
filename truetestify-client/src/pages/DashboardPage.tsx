import { useContext, useState } from "react";
import VideoReviewCard from "../components/VideoReviewCard";
import ReviewRecorder from "../components/ReviewRecorder";
import { mockReviews } from "../mock/reviews";
import AudioReviewCard from "../components/AudioReviewCard";
import TextReviewCard from "../components/TextReviewCard";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContex";

function DashboardPage() {
   const {reviews,setReviwes} = useContext(UserContext);
  const [allowTextReviews, setAllowTextReviews] = useState(true);
  // const [reviews, setReviews] = useState(mockReviews);

  // const pendingReviews = reviews.filter((r) => r.status === "pending");
  // const approvedReviews = reviews.filter((r) => r.status === "approved");
  // const videos = mockReviews.filter((r) => r.type === "video");
  // const audios = mockReviews.filter((r) => r.type === "audio");
  // const text = mockReviews.filter((r) => r.type === "text");
  const businessName = localStorage.getItem("businessName")
  const handleApprove = (id: string) => {
    setReviwes(
      reviews.map((r) => (r.id === id ? { ...r, approved: !false } : r))
    );
  };
   const handleReject = (id: string) => {
    setReviwes(
      reviews.map((r) => (r.id === id ? { ...r, approved: false } : r))
    );
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Business Dashboard
      </h1>
      <Link to={`/business/${businessName}`} className="text-black">go to your business</Link>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Review Controls</h2>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={allowTextReviews}
            onChange={(e) => setAllowTextReviews(e.target.checked)}
            className="accent-primary"
          />
          <span className="text-gray-700">Allow Written Reviews</span>
        </label>
      </section>
{/* 
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">Pending Moderation</h2>
        {reviews.length ? (
          <div className="grid md:grid-cols-2 gap-4">{reviews.length}
            {reviews.map((review) => (
              <VideoReviewCard key={review.id} {...review} />
            ))}
            {reviews.map((review) => (
              <AudioReviewCard key={review.id} {...review}  />
            ))}
            {reviews.map((review) => (
              <TextReviewCard key={review.id} {...review}  />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews awaiting moderation.</p>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3">Published Reviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-2 border rounded-2xl border-blue-300">
          {reviews.map((review) => (
            <VideoReviewCard key={review.id} {...review} url="" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-2 border rounded-2xl border-blue-300">
          {reviews.map((review) => (
            <AudioReviewCard key={review.id} {...review} audiourl="" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-2 border rounded-2xl border-blue-300">
          {reviews.map((review) => (
            <TextReviewCard key={review.id} {...review} content={review.content||""} />
          ))}
        </div>
      </section> */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded p-4 bg-white shadow"
          >
            <p className="font-semibold">{review.author}</p>
            <p className="text-gray-600">{review.content}</p>
            <p className="text-gray-600">
              {review.file ? review.file.name : null}
            </p>
            {!review.approved && (
              <>
              <button
                onClick={() => handleApprove(review.id)}
                className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
                >
                Approve
              </button>
              
                </>
              
            )}
            {review.approved && (
              <>
              <span className="mt-2 inline-block text-green-600 font-medium">
                Approved
              </span>
              <button
                onClick={() => handleReject(review.id)}
                className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
                >
                Reject
              </button>
              </>
            )}
          </div>
        ))}
      </div>
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Record New Review</h2>
        <ReviewRecorder />
      </section>
    </div>
  );
}

export default DashboardPage;
