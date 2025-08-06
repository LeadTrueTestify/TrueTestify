import { useState } from 'react';

const ReviewRecorder = () => {
  const [recording, setRecording] = useState(false);

  const handleRecord = () => {
    alert("Mock recording started...");
    setRecording(true);
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md">
      <p className="mb-2">Record your video or audio review below</p>
      <button
        onClick={handleRecord}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {recording ? "Recording..." : "Start Recording"}
      </button>
    </div>
  );
};

export default ReviewRecorder;