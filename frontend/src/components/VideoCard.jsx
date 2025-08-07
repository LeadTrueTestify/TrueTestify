const VideoCard = ({ video }) => (
  <div className="bg-gray-100 rounded-lg shadow-sm overflow-hidden border-2 border-transparent hover:border-orange-500 transition-colors">
    <video src={video.url} controls className="w-full h-auto rounded-t-lg" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
    </div>
  </div>
);

export default VideoCard;