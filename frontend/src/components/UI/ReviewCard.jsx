import { MicrophoneIcon } from "@heroicons/react/16/solid";

const ReviewCard = ({ review }) => (
  <div className="bg-gray-100 rounded-lg shadow-sm overflow-hidden border-2 border-transparent hover:border-orange-500 transition-colors">
    {review.type === 'video' && <video src={review.url} controls className="w-full h-auto rounded-t-lg" />}
    {review.type === 'audio' && (
      <div className="p-4 flex flex-col items-center justify-center bg-gray-200">
        <MicrophoneIcon className="h-16 w-16 text-gray-400" />
        <audio src={review.url} controls className="w-full mt-4" />
      </div>
    )}
    {review.type === 'text' && (
      <div className="p-4 h-full flex flex-col justify-between">
        <p className="text-gray-700 italic">"{review.content}"</p>
        <span className="mt-4 text-right text-sm font-medium text-gray-500">- Anonymous Reviewer</span>
      </div>
    )}
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800">{review.title}</h3>
    </div>
  </div>
);

export default ReviewCard