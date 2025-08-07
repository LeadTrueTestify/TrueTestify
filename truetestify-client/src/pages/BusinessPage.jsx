import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewRecorder from "../components/ReviewRecorder";
import { UserContext } from "../context/UserContex";

// interface Review {
//   id: string;
//   content: string;
//   author: string;
//   file : File | null;
//   approved: boolean;
// }
// interface Review {
//   id: string;
//   url: File | null;
//   // url: string,
//   content?: string;
//   author: string;
//   rating: Number;
//   createdAt: string;
//   approved: boolean;
// }
const BusinessPage = () => {
  const { reviews, setReviwes, allowTextReviews } = useContext(UserContext);
  const { slug } = useParams();
  // const [reviews, setReviews] = useState<Review[]>([]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  // const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [url, setUrl] = useState(null);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isValid =
        selectedFile.type.startsWith("video") ||
        selectedFile.type.startsWith("audio");

      if (isValid) {
        setUrl(selectedFile);
        console.log("selected file " + selectedFile.name);
      }
    } else {
      setUrl(null);
    }
  };

  const today = new Date();
  const handleAddReview = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now().toString(),
      content,
      author,
      // file,
      url,
      rating,
      createdAt: today.toLocaleDateString(),
      approved: false,
    };
    setReviwes([newReview, ...reviews]);
    setContent("");
    setAuthor("");

    setUrl(null);
  };

  // const handleApprove = (id: string) => {
  //   setReviwes(
  //     reviews.map((r) => (r.id === id ? { ...r, approved: !false } : r))
  //   );
  // };
  //  const handleReject = (id: string) => {
  //   setReviwes(
  //     reviews.map((r) => (r.id === id ? { ...r, approved: false } : r))
  //   );
  // };
  return (
    <div className="p-6 max-w-3xl mx-auto mb-40">
      <h1 className="text-2xl font-bold text-primary mb-6">{slug}</h1>
      <h2 className="text-2xl font-bold text-primary mb-6">
        Business Review Panel
      </h2>
      <ReviewRecorder />
      <form onSubmit={handleAddReview} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        {allowTextReviews && (
          <textarea
            placeholder="Write a review..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          ></textarea>
        )}
        <div className="p-4">
          <label htmlFor="mediaUpload" className="block mb-2 font-semibold">
            Upload Video/Audio
          </label>
          <input
            className="block border border-gray-600 rounded "
            type="file"
            id="mediaUpload"
            accept="video/*,audio/*"
            onChange={handleFileUpload}
          />
          <label htmlFor="rating" className="block mb-2 font-semibold">
            Rating
          </label>
          <input
            className="block border border-gray-600 rounded "
            type="number"
            maxLength={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>

      {/* <div className="space-y-4">
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
      </div> */}
    </div>
  );
};

export default BusinessPage;
