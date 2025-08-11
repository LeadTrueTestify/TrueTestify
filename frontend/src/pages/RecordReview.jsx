import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import {
  DocumentTextIcon,
  MicrophoneIcon,
  StopIcon,
  VideoCameraIcon,
} from "@heroicons/react/16/solid";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { MOCK_REVIEWS } from "../assets/mockData";

//  RecordReview.jsx
const RecordReview = () => {
  const { getInitialData, user } = useContext(AuthContext);
  const businessName = user.publicReviewUrl;
  const [hasConsented, setHasConsented] = useState(false);
  const [mediaType, setMediaType] = useState("video"); // 'video', 'audio', 'text'
  const [isRecording, setIsRecording] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [textReview, setTextReview] = useState("");
  const [allowTextReviews, setAllowTextReviews] = useState(
    getInitialData("allowTextReviews", false)
  );
  const navigate = useNavigate();

  // State for MediaRecorder
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [mediaChunks, setMediaChunks] = useState([]);

  // Ref for the video preview element
  const videoRef = useRef(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setAllowTextReviews(getInitialData("allowTextReviews", false));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Use a useEffect hook to handle the final recorded file after chunks are collected
  useEffect(() => {
    if (mediaChunks.length > 0 && !isRecording) {
      const blob = new Blob(mediaChunks, { type: mediaChunks[0].type });
      const file = new File(
        [blob],
        `review_${Date.now()}.${mediaType === "video" ? "webm" : "webm"}`,
        { type: blob.type }
      );
      setMediaFile(file);
    }
  }, [mediaChunks, isRecording, mediaType]);

  const startRecording = async () => {
    // Clear chunks and previous file
    setMediaChunks([]);
    setMediaFile(null);
    setStream(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: mediaType === "video",
        audio: true,
      });
      setStream(mediaStream);

      // Assign the media stream to the video element for live preview
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const options = {
        mimeType: mediaType === "video" ? "video/webm" : "audio/webm",
      };
      const recorder = new MediaRecorder(mediaStream, options);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setMediaChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      recorder.onstop = () => {
        // Only stop the tracks if the stream is available
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
        // Clear the video preview
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        setStream(null);
        setMediaRecorder(null);
        setIsRecording(false);
        toast.success("Recording stopped.");
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.success(`Recording started! Click stop when you're done.`);
    } catch (err) {
      console.error("Recording error:", err);
      toast.error(`Error starting recording: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      toast.success("Review ready to submit!");
    }
    setStream(null);
    setMediaRecorder(null);
    setIsRecording(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasConsented) {
      toast.error("Please agree to the terms before submitting.");
      return;
    }

    if (mediaType !== "text" && !mediaFile) {
      toast.error(`Please record or upload a ${mediaType}.`);
      return;
    }
    if (mediaType === "text" && textReview.trim().length < 10) {
      toast.error("Text review must be at least 10 characters.");
      return;
    }

    // Add review to local storage
    const newReview = {
      id: Date.now(),
      type: mediaType,
      title:
        mediaType === "text" ? "New Text Review" : `New ${mediaType} Review`,
      status: "pending",
      url: mediaFile ? URL.createObjectURL(mediaFile) : null,
      content: mediaType === "text" ? textReview : null,
    };

    const allReviews = getInitialData("reviews", MOCK_REVIEWS);
    const updatedReviews = [...allReviews, newReview];
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));

    toast.success("Your review has been submitted for moderation!");

    // Reset form and redirect
    setMediaFile(null);
    setTextReview("");
    setHasConsented(false);
    setTimeout(() => navigate("/"), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaType(file.type.startsWith("video") ? "video" : "audio");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-4 mt-2 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Leave a Review</h2>

      <div className="mb-6 flex justify-center space-x-2 p-2 bg-gray-100 rounded-lg">
        <button
          onClick={() => setMediaType("video")}
          className={`flex-1 flex justify-center items-center px-4 py-2 rounded-full font-semibold transition-colors ${
            mediaType === "video"
              ? "bg-orange-500 text-white"
              : "bg-transparent text-gray-700 hover:bg-gray-200"
          }`}
        >
          <VideoCameraIcon className="h-5 w-5 mr-2" /> Video
        </button>
        <button
          onClick={() => setMediaType("audio")}
          className={`flex-1 flex justify-center items-center px-4 py-2 rounded-full font-semibold transition-colors ${
            mediaType === "audio"
              ? "bg-orange-500 text-white"
              : "bg-transparent text-gray-700 hover:bg-gray-200"
          }`}
        >
          <MicrophoneIcon className="h-5 w-5 mr-2" /> Audio
        </button>
        {allowTextReviews && (
          <button
            onClick={() => setMediaType("text")}
            className={`flex-1 flex justify-center items-center px-4 py-2 rounded-full font-semibold transition-colors ${
              mediaType === "text"
                ? "bg-orange-500 text-white"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" /> Text
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mediaType === "text" ? (
          <div>
            <label
              htmlFor="text-review"
              className="block text-sm font-medium text-gray-700"
            >
              Write your review
            </label>
            <textarea
              id="text-review"
              value={textReview}
              onChange={(e) => setTextReview(e.target.value)}
              rows="6"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Start typing your review here..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Record or Upload {mediaType}
            </label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="space-y-1 text-center">
                {isRecording && mediaType === "video" && (
                  <div className="w-full rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 bg-gray-200">
                    <VideoCameraIcon className="h-35 w-35 text-gray-400 animate-pulse" />
                    <p className="text-xl font-bold text-gray-600 mt-2">
                      Recording...
                    </p>
                  </div>
                )}
                {mediaFile ? (
                  <>
                    {mediaType === "video" ? (
                      <video
                        src={URL.createObjectURL(mediaFile)}
                        controls
                        className="h-half w-auto mx-auto rounded-md"
                      />
                    ) : (
                      <audio
                        src={URL.createObjectURL(mediaFile)}
                        controls
                        className="w-full mx-auto"
                      />
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {mediaFile.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => setMediaFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove File
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center space-x-4">
                      {isRecording ? (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <StopIcon className="h-5 w-5 mr-2" /> Stop Recording
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          <VideoCameraIcon className="h-5 w-5 mr-2" /> Record{" "}
                          {mediaType}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-4">OR</p>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept={mediaType === "video" ? "video/*" : "audio/*"}
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                  </>
                )}
                <p className="text-xs text-gray-500">
                  MP4/WEBM up to 60 seconds
                </p>
              </div>
            </div>
          </div>
        )}

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
              {`I agree to be recorded and allow ${
                !businessName ? "businessName" : businessName
              } to use my review
              publicly.`}
            </label>
          </div>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            className={`w-full px-4 py-3 text-lg font-bold rounded-full transition-colors ${
              hasConsented &&
              (mediaFile || (mediaType === "text" && textReview.trim()))
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={
              !(
                hasConsented &&
                (mediaFile || (mediaType === "text" && textReview.trim()))
              )
            }
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

// USE When the Database is connected

// Helper function to convert a File/Blob to a Base64 string
// const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };

// const RecordReview = () => {
//   const {getInitialData} =useContext(AuthContext)
//   const [hasConsented, setHasConsented] = useState(false);
//   const [mediaType, setMediaType] = useState('video'); // 'video', 'audio', 'text'
//   const [isRecording, setIsRecording] = useState(false);
//   // Renamed mediaFile to recordedMedia for clarity, as it now holds a Base64 string
//   const [recordedMedia, setRecordedMedia] = useState(null);
//   const [textReview, setTextReview] = useState('');
//   const [allowTextReviews, setAllowTextReviews] = useState(getInitialData('allowTextReviews', false));
//   const navigate = useNavigate();

//   // State for MediaRecorder
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [mediaChunks, setMediaChunks] = useState([]);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setAllowTextReviews(getInitialData('allowTextReviews', false));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   // Use a useEffect hook to handle the final recorded file after chunks are collected
//   useEffect(() => {
//     // When recording stops and chunks are collected, convert the blob to Base64
//     if (mediaChunks.length > 0 && !isRecording) {
//       const blob = new Blob(mediaChunks, { type: mediaChunks[0].type });
//       fileToBase64(blob)
//         .then(base64Data => {
//           setRecordedMedia(base64Data);
//         })
//         .catch(err => {
//           console.error("Failed to convert blob to Base64:", err);
//           toast.error("Failed to process recording.");
//         });
//     }
//   }, [mediaChunks, isRecording, mediaType]);

//   const startRecording = async () => {
//     // Clear chunks and previous file
//     setMediaChunks([]);
//     setRecordedMedia(null);
//     setStream(null);

//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: mediaType === 'video',
//         audio: true
//       });
//       setStream(mediaStream);

//       const options = { mimeType: mediaType === 'video' ? 'video/webm' : 'audio/webm' };
//       const recorder = new MediaRecorder(mediaStream, options);

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           setMediaChunks(prevChunks => [...prevChunks, event.data]);
//         }
//       };

//       // The onstop event handler will fire after `mediaRecorder.stop()`
//       recorder.onstop = () => {
//         setStream(null);
//         setMediaRecorder(null);
//         setIsRecording(false);
//         toast.success('Recording stopped.');
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setIsRecording(true);
//       toast.success(`Recording started! Click stop when you're done.`);
//     } catch (err) {
//       console.error("Recording error:", err);
//       toast.error(`Error starting recording: ${err.message}`);
//     }
//   };

//   // UPDATED: This function now immediately stops the stream tracks and the recorder
//   const stopRecording = () => {
//     if (mediaRecorder && stream) {
//       mediaRecorder.stop();
//       stream.getTracks().forEach(track => track.stop()); // Immediately stops the camera/mic
//       setStream(null); // Clear the stream state
//       setIsRecording(false);
//       toast.success('Review ready to submit!');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!hasConsented) {
//       toast.error('Please agree to the terms before submitting.');
//       return;
//     }

//     if (mediaType !== 'text' && !recordedMedia) {
//       toast.error(`Please record or upload a ${mediaType}.`);
//       return;
//     }
//     if (mediaType === 'text' && textReview.trim().length < 10) {
//       toast.error('Text review must be at least 10 characters.');
//       return;
//     }

//     // Add review to local storage
//     const newReview = {
//       id: Date.now(),
//       type: mediaType,
//       title: mediaType === 'text' ? 'New Text Review' : `New ${mediaType} Review`,
//       status: 'pending',
//       // Store the Base64 data directly, not a temporary blob URL
//       dataUrl: mediaType !== 'text' ? recordedMedia : null,
//       // Keep a fallback url for the mock data, although not ideal
//       url: mediaType !== 'text' ? null : null,
//       content: mediaType === 'text' ? textReview : null,
//     };

//     const allReviews = getInitialData('reviews', MOCK_REVIEWS);
//     const updatedReviews = [...allReviews, newReview];
//     localStorage.setItem('reviews', JSON.stringify(updatedReviews));

//     toast.success('Your review has been submitted for moderation!');

//     // Reset form and redirect
//     setRecordedMedia(null);
//     setTextReview('');
//     setHasConsented(false);

//     setTimeout(() => {
//         navigate('/');
//     }, 2000);
//   };

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         const base64Data = await fileToBase64(file);
//         setRecordedMedia(base64Data);
//         setMediaType(file.type.startsWith('video') ? 'video' : 'audio');
//       } catch (err) {
//         toast.error("Failed to read file.");
//       }
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       handleFileUpload({ target: { files: [file] } });
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div className="mt-2 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
//       <h2 className="text-3xl font-bold text-blue-600 mb-4">Leave a Review</h2>

//       <div className="mb-6 flex justify-center space-x-2 p-2 bg-gray-100 rounded-lg">
//         <button onClick={() => setMediaType('video')} className={`flex-1 flex justify-center items-center px-4 py-2 rounded-full font-semibold transition-colors ${mediaType === 'video' ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}>
//           <VideoCameraIcon className="h-5 w-5 mr-2" /> Video
//         </button>
//         <button onClick={() => setMediaType('audio')} className={`flex-1 flex justify-center items-center px-4 py-2 rounded-full font-semibold transition-colors ${mediaType === 'audio' ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}>
//           <MicrophoneIcon className="h-5 w-5 mr-2" /> Audio
//         </button>
//         {allowTextReviews && (
//           <button onClick={() => setMediaType('text')} className={`flex-1 flex justify-center items-center px-4 py-2 rounded-full font-semibold transition-colors ${mediaType === 'text' ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}>
//             <DocumentTextIcon className="h-5 w-5 mr-2" /> Text
//           </button>
//         )}
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {mediaType === 'text' ? (
//           <div>
//             <label htmlFor="text-review" className="block text-sm font-medium text-gray-700">
//               Write your review
//             </label>
//             <textarea
//               id="text-review"
//               value={textReview}
//               onChange={(e) => setTextReview(e.target.value)}
//               rows="6"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
//               placeholder="Start typing your review here..."
//             />
//           </div>
//         ) : (
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Record or Upload {mediaType}
//             </label>
//             <div
//               className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
//               onDrop={handleDrop}
//               onDragOver={handleDragOver}
//             >
//               <div className="space-y-1 text-center">
//                 {isRecording ? (
//                   <>
//                   <div className="w-full rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 bg-gray-200">
//                     <VideoCameraIcon className="h-16 w-16 text-gray-400 animate-pulse" />
//                     <p className="text-xl font-bold text-gray-600 mt-2">Recording...</p>
//                   </div>
//                    {/* UPDATED: The Stop button is back */}
//                   <button type="button" onClick={stopRecording} className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-full shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
//                     <StopIcon className="h-5 w-5 mr-2" /> Stop Recording
//                   </button>
//                   </>
//                 ) : recordedMedia ? (
//                   <>
//                     {mediaType === 'video' ? (
//                       // Use the Base64 data for the video source
//                       <video src={recordedMedia} controls className="h-32 w-auto mx-auto rounded-md" />
//                     ) : (
//                       // Use the Base64 data for the audio source
//                       <audio src={recordedMedia} controls className="w-full mx-auto" />
//                     )}
//                     <p className="text-sm text-gray-500 mt-2">Preview of your review</p>
//                     <button type="button" onClick={() => setRecordedMedia(null)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove Preview</button>
//                   </>
//                 ) : (
//                   <>
//                     <div className="flex justify-center space-x-4">
//                       <button type="button" onClick={startRecording} className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
//                         <VideoCameraIcon className="h-5 w-5 mr-2" /> Record {mediaType}
//                       </button>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-4">OR</p>
//                     <div className="flex text-sm text-gray-600">
//                       <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus:ring-orange-500">
//                         <span>Upload a file</span>
//                         <input id="file-upload" name="file-upload" type="file" className="sr-only" accept={mediaType === 'video' ? 'video/*' : 'audio/*'} onChange={handleFileUpload} />
//                       </label>
//                       <p className="pl-1">or drag and drop</p>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="flex items-start">
//           <div className="flex items-center h-5">
//             <input
//               id="consent"
//               name="consent"
//               type="checkbox"
//               checked={hasConsented}
//               onChange={(e) => setHasConsented(e.target.checked)}
//               className="focus:ring-orange-500 h-4 w-4 text-orange-500 border-gray-300 rounded"
//             />
//           </div>
//           <div className="ml-3 text-sm">
//             <label htmlFor="consent" className="font-medium text-gray-700">
//               I agree to be recorded and allow [Business] to use my review publicly.
//             </label>
//           </div>
//         </div>

//         <div className="pt-5">
//           <button
//             type="submit"
//             className={`w-full px-4 py-3 text-lg font-bold rounded-full transition-colors ${
//               (hasConsented && (recordedMedia || (mediaType === 'text' && textReview.trim())))
//                 ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg'
//                 : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//             }`}
//             disabled={!(hasConsented && (recordedMedia || (mediaType === 'text' && textReview.trim())))}
//           >
//             Submit Review
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

export default RecordReview;
