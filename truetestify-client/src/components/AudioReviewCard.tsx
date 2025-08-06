import React from 'react';

type Props = {
  audiourl?: string;
  author: string;
  rating: number;
  createdAt: string;
};

const AudioReviewCard: React.FC<Props> = ({ audiourl, author, rating, createdAt }) => (
  <div className="bg-blue-300 rounded shadow p-4 grid grid-cols-1">
    <audio controls className="w-full">
      <source src={audiourl} type="audio/mpeg" />
    </audio>
    <div className="mt-2">
      <p className="font-semibold">{author} ★ {rating}</p>
      <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  </div>
);

export default AudioReviewCard;