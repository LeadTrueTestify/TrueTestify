import { MicrophoneIcon } from "@heroicons/react/16/solid";

const ReviewCard = ({ review, isPreview = false }) => (
  <div className="bg-gray-50 border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md">
    {review.type === 'video' && <video src={review.dataUrl || review.url} controls={!isPreview} autoPlay={isPreview} muted={isPreview} playsInline={isPreview} className="w-full h-auto object-cover" />}
    {review.type === 'audio' && (
      <div className="p-4 flex flex-col items-center justify-center bg-gray-100">
        <MicrophoneIcon className="h-16 w-16 text-gray-400" />
        <audio src={review.dataUrl || review.url} controls className="w-full mt-4" />
      </div>
    )}
    {review.type === 'text' && (
      <div className="p-6 h-full flex flex-col justify-between">
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