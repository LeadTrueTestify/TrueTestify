const AnalyticsCard = ({ title, value, icon, color }) => (
  <div
    className={`bg-white p-6 border border-gray-200 shadow-sm flex items-center justify-between transition-colors duration-200 hover:border-gray-400`}
  >
    <div>
      <h3 className="text-lg text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div
      className={`p-3 border-2 ${
        color === "blue"
          ? "border-blue-500 text-blue-500"
          : "border-orange-500 text-orange-500"
      }`}
    >
      {icon}
    </div>
  </div>
);
export default AnalyticsCard;
