import { useNavigate } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";
import { useState } from "react";
import { PlayIcon } from "@heroicons/react/16/solid";

const RecordReview = () => {
  const [hasConsented, setHasConsented] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasConsented) {
      toast.error('Please agree to the terms before submitting.');
      return;
    }
    if (!videoFile) {
      toast.error('Please record or upload a video.');
      return;
    }
    // Simulate API call
    console.log('Submitting video:', videoFile);
    toast.success('Your review has been submitted for moderation!');
    // Redirect to home after a brief delay
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Leave a Video Review</h2>
        <p className="text-gray-600 mb-6">
          Share your experience in a short video (max 60 seconds).
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Record or Upload Video
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {videoFile ? (
                  <>
                    <video src={URL.createObjectURL(videoFile)} controls className="h-32 w-auto mx-auto rounded-md" />
                    <p className="text-sm text-gray-500 mt-2">{videoFile.name}</p>
                  </>
                ) : (
                  <>
                    <PlayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                  </>
                )}
                <p className="text-xs text-gray-500">MP4 up to 60 seconds</p>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="focus:ring-orange-500 h-4 w-4 text-orange-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="consent" className="font-medium text-gray-700">
                I agree to be recorded and allow [Business] to use my video publicly.
              </label>
            </div>
          </div>

          <div className="pt-5">
            <button
              type="submit"
              className={`w-full px-4 py-3 text-lg font-bold rounded-full transition-colors ${
                hasConsented && videoFile
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!hasConsented || !videoFile}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordReview;