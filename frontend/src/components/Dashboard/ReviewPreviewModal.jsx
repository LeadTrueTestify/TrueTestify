import { XMarkIcon } from "@heroicons/react/16/solid";

const ReviewPreviewModal = ({ review, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 z-50 bg-gray-800 rounded-full p-1"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">Review Preview</h3>
          {review.type === 'video' && (
            <video src={review.url} controls className="w-full rounded-lg" autoPlay />
          )}
          {review.type === 'audio' && (
            <audio src={review.url} controls className="w-full" autoPlay />
          )}
          {review.type === 'text' && (
            <div className="p-6 bg-gray-100 rounded-lg">
              <p className="text-lg text-gray-800 italic">"{review.content}"</p>
              <p className="mt-4 text-right text-sm text-gray-500 font-semibold">
                - {review.title}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPreviewModal;