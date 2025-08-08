import {
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  MicrophoneIcon,
  PlayIcon,
  VideoCameraIcon,
} from "@heroicons/react/16/solid";
import AnalyticsCard from "../UI/AnalyticsCard";
import { MOCK_REVIEWS } from "../../assets/mockData";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Analytics = () => {
  const { getInitialData } = useContext(AuthContext);
  const reviews = getInitialData("reviews", MOCK_REVIEWS);
  const data = {
    videosCollected: reviews.filter((r) => r.type === "video").length,
    audioCollected: reviews.filter((r) => r.type === "audio").length,
    textCollected: reviews.filter((r) => r.type === "text").length,
    widgetViews: 1542, // Static mock data
    storageUsed: 3.5, // GB, static mock data
    storageLimit: 10, // GB, static mock data
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Videos Collected"
          value={data.videosCollected}
          icon={<VideoCameraIcon />}
          color="blue"
        />
        <AnalyticsCard
          title="Audio Collected"
          value={data.audioCollected}
          icon={<MicrophoneIcon />}
          color="blue"
        />
        <AnalyticsCard
          title="Text Reviews"
          value={data.textCollected}
          icon={<DocumentTextIcon />}
          color="blue"
        />
        <AnalyticsCard
          title="Widget Views"
          value={data.widgetViews}
          icon={<ChartBarIcon />}
          color="orange"
        />
        <AnalyticsCard
          title="Storage Remaining"
          value={`${data.storageLimit - data.storageUsed} GB`}
          icon={<CogIcon />}
          color="blue"
        />
      </div>
    </div>
  );
};
export default Analytics;
