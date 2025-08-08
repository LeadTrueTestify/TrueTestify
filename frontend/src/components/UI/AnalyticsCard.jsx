// const AnalyticsCard = ({ title, value, icon, color }) => (
//   <div
//     className={`bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-l-4 ${
//       color === "blue" ? "border-blue-500" : "border-orange-500"
//     }`}
//   >
//     <div>
//       <h3 className="text-lg text-gray-500">{title}</h3>
//       <p className="text-3xl font-bold text-gray-800">{value}</p>
//     </div>
//     <div
//       className={`p-3 rounded-full ${
//         color === "blue"
//           ? "bg-blue-100 text-blue-500"
//           : "bg-orange-100 text-orange-500"
//       }`}
//     >
//       {icon}
//     </div>
//   </div>
// );

const AnalyticsCard = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md flex items-center justify-between border-l-4 ${color === 'blue' ? 'border-blue-500' : 'border-orange-500'}`}>
    <div>
      <h3 className="text-lg text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color === 'blue' ? 'bg-blue-100 text-blue-500' : 'bg-orange-100 text-orange-500'}`}>
      {icon}
    </div>
  </div>
);
export default AnalyticsCard;
