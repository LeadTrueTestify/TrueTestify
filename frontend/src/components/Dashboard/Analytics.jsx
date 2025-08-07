import { ChartBarIcon, CogIcon, PlayIcon } from "@heroicons/react/16/solid";
import AnalyticsCard from "../UI/AnalyticsCard";

const Analytics = () => {
  // Mock data
  const data = {
    videosCollected: 23,
    widgetViews: 1542,
    storageUsed: 3.5, // GB
    storageLimit: 10, // GB
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard title="Videos Collected" value={data.videosCollected} icon={<PlayIcon />} color="blue" />
        <AnalyticsCard title="Widget Views" value={data.widgetViews} icon={<ChartBarIcon />} color="orange" />
        <AnalyticsCard title="Storage Remaining" value={`${data.storageLimit - data.storageUsed} GB`} icon={<CogIcon />} color="blue" />
      </div>
    </div>
  );
};

export default Analytics;