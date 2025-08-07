import { useContext } from "react";
import VideoReviewCard from "../components/VideoReviewCard";
import AudioReviewCard from "../components/AudioReviewCard";
import TextReviewCard from "../components/TextReviewCard";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContex";

function DashboardPage() {
  const navigate = useNavigate();
  const { reviews, setReviwes, setUser,allowTextReviews,setAllowTextReviews } = useContext(UserContext);
  // const [allowTextReviews, setAllowTextReviews] = useState(true);
  // console.log(reviews);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setUser(false);
  };

  // const [reviews, setReviews] = useState(mockReviews);

  const pendingReviews = reviews.filter((r) => r.approved === false);
  const approvedReviews = reviews.filter((r) => r.approved === true);
  // const videos = reviews.filter((r) => r.file?.type === "video/");
  // const audios = reviews.filter((r) => r.file?.type === "audio/");
  // const text = mockReviews.filter((r) => r.type === "text");
  const businessName = localStorage.getItem("businessName");
  const handleApprove = (id) => {
    setReviwes(
      reviews.map((r) => (r.id === id ? { ...r, approved: !false } : r))
    );
  };
  const handleReject = (id) => {
    setReviwes(
      reviews.map((r) => (r.id === id ? { ...r, approved: false } : r))
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary flex">
        Business Dashboard
      </h1>
      <Link
        to={`/business/${businessName}`}
        className="text-black border rounded border-blue-300 bg-blue-500 hover:bg-blue-600 mx-2 my-2 flex items-start justify-center w-50"
      >
        go to your business
      </Link>
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

      <section className="mb-12 border-blue-300 rounded bg-blue-400">
        <h2 className="text-xl font-semibold mb-3 px-2">Pending Moderation</h2>
        {pendingReviews.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {pendingReviews.length}
            {pendingReviews
              .filter((review) => review.url?.type?.startsWith("video"))
              .map((review) => (
                <VideoReviewCard
                  type={review.url?.type || "video/mp4"}
                  key={review.id}
                  {...review}
                  url={review.url?.name || ""}
                  rating={Number(review.rating)}
                />
              ))}
            {/* {videos.map((review) => (

            ))} */}
            {pendingReviews
              .filter((review) => review.url?.type?.startsWith("audio"))
              .map((review) => (
                <AudioReviewCard
                  type={review.url?.type || "audio/mp3"}
                  key={review.id}
                  {...review}
                  url={review.url?.name || ""}
                  rating={Number(review.rating)}
                />
              ))}
            {/* {audios.map((review) => (
              <AudioReviewCard key={review.id} {...review} />
            ))} */}
            {pendingReviews
              .filter((review) => review.content !== "")
              .map((review) => (
                <TextReviewCard
                  key={review.id}
                  {...review}
                  rating={Number(review.rating)}
                  content={review.content || ""}
                />
              ))}
          </div>
        ) : (
          <p className="text-white mx-2 text-sm my-2">No reviews awaiting moderation.</p>
        )}
      </section>

      <section className="mb-12 border border-blue-300 rounded bg-blue-400">
        <h2 className="text-xl font-semibold mb-3 px-2">Published Reviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {approvedReviews
            .filter((review) => review.url?.type?.startsWith("video"))
            .map((review) => (
              <VideoReviewCard
                key={review.id}
                {...review}
                url={review.url?.name || ""}
                type={review.url?.type || "video/mp4"}
                rating={Number(review.rating)}
              />
            ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {approvedReviews
            .filter((review) => review.url?.type?.startsWith("audio"))
            .map((review) => (
              <AudioReviewCard
                key={review.id}
                {...review}
                url={review.url?.name || ""}
                type={review.url?.type || "audio/mpeg"}
                rating={Number(review.rating)}
              />
            ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-2">
          {approvedReviews
            .filter((review) => review.content !== "")
            .map((review) => (
              <TextReviewCard
                key={review.id}
                {...review}
                rating={Number(review.rating)}
                content={review.content || ""}
              />
            ))}
        </div>
      </section>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded p-4 bg-white shadow">
            <p className="font-semibold">{review.author}</p>
            <p className="text-gray-600">{review.content}</p>
            <p className="text-gray-600">
              {review.url ? review.url.name : null}
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
      {/* <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Record New Review</h2>
        <ReviewRecorder />
      </section> */}
      <button
        onClick={() => handleLogout()}
        className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
