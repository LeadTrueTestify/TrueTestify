import { TrashIcon } from "@heroicons/react/16/solid";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MOCK_REVIEWS } from "../../assets/mockData";
import toast from "react-hot-toast";
import ReviewPreviewModal from "./ReviewPreviewModal";



const Moderation = () => {
  const { getInitialData } = useContext(AuthContext);
  const [reviews, setReviews] = useState(getInitialData('reviews', MOCK_REVIEWS));
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setReviews(getInitialData('reviews', MOCK_REVIEWS));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateReview = (id, newStatus) => {
    const updatedReviews = reviews.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
    toast.success(`Review ${id} has been ${newStatus}.`);
    setIsModalOpen(false); // Close modal on action
  };

  const openModal = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Moderation Dashboard</h2>
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 p-4 border border-gray-200 justify-between transition-all duration-200 cursor-pointer hover:bg-gray-100" onClick={() => openModal(review)}>
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              {review.type === 'video' && <video src={review.dataUrl || review.url} controls className="w-24 h-auto object-cover" onClick={(e) => e.stopPropagation()} />}
              {review.type === 'audio' && <audio src={review.dataUrl || review.url} controls className="w-24 h-auto object-cover" onClick={(e) => e.stopPropagation()} />}
              {review.type === 'text' && (
                <div className="w-24 border border-gray-200 bg-white p-2 flex items-center h-24">
                  <p className="text-sm text-gray-500 overflow-hidden text-ellipsis line-clamp-3">
                    {review.content}
                  </p>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{review.title}</h3>
                <span className={`text-sm font-medium px-2 py-1 tracking-wide ${
                  review.status === 'pending' ? 'bg-orange-100 text-orange-500' :
                  review.status === 'approved' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {review.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0" onClick={(e) => e.stopPropagation()}>
              {review.status === 'pending' && (
                <>
                  <button onClick={() => updateReview(review.id, 'approved')} className="bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700 transition-colors">Approve</button>
                  <button onClick={() => updateReview(review.id, 'rejected')} className="bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition-colors">Reject</button>
                </>
              )}
              {review.status !== 'pending' && (
                <button onClick={() => updateReview(review.id, 'deleted')} className="bg-red-600 text-white px-4 py-2 font-medium hover:bg-red-700 transition-colors">
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedReview && (
        <ReviewPreviewModal review={selectedReview} onClose={closeModal} />
      )}
    </>
  );
};

export default Moderation;
