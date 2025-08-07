const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
    <div className="flex-shrink-0 text-orange-500 bg-orange-100 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-blue-600">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);
export default FeatureCard;