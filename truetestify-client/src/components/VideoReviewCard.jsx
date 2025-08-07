import React from 'react';

// type Props = {
//   url?: string;
//   author: string;
//   rating: number;
//   createdAt: string;
//   type: string;
// };

const VideoReviewCard = ({ url ,type , author, rating, createdAt }) => (
  <div className="bg-blue-300 rounded shadow p-4 grid grid-cols-1">
    <video controls className="w-full">
      <source src={url} type={type || "video"}/>
    </video>
    <div className="mt-2">
      <p className="font-semibold">{author} ★★★★★ {rating}</p>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  </div>
);

export default VideoReviewCard;