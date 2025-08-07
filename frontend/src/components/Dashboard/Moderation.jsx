import { TrashIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

const Moderation = () => {
  const [videos, setVideos] = useState([
    { id: 1, title: 'Pending Review 1', status: 'pending', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 2, title: 'Pending Review 2', status: 'pending', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 3, title: 'Approved Review 1', status: 'approved', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { id: 4, title: 'Rejected Review 1', status: 'rejected', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  ]);

  const handleAction = (id, status) => {
    setVideos(videos.map(video => video.id === id ? { ...video, status } : video));
    toast.success(`Video ${id} has been ${status}.`);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Moderation Dashboard</h2>
      <div className="space-y-4">
        {videos.map(video => (
          <div key={video.id} className="flex flex-col sm:flex-row items-center bg-gray-100 p-4 rounded-lg shadow-sm justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <video src={video.url} controls className="w-24 h-auto rounded-lg" />
              <div>
                <h3 className="font-semibold">{video.title}</h3>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  video.status === 'pending' ? 'bg-orange-100 text-orange-500' :
                  video.status === 'approved' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {video.status}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {video.status === 'pending' && (
                <>
                  <button onClick={() => handleAction(video.id, 'approved')} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">Approve</button>
                  <button onClick={() => handleAction(video.id, 'rejected')} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">Reject</button>
                </>
              )}
              {video.status !== 'pending' && (
                <button onClick={() => handleAction(video.id, 'deleted')} className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Moderation;