import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Settings from "./Settings";

const AdminSettings = () => {
  const { getInitialData } = useContext(AuthContext);
  const [allowTextReviews, setAllowTextReviews] = useState(getInitialData('allowTextReviews', false));

  const handleToggle = () => {
    const newSetting = !allowTextReviews;
    localStorage.setItem('allowTextReviews', JSON.stringify(newSetting));
    setAllowTextReviews(newSetting);
    toast.success(`Text reviews are now ${newSetting ? 'enabled' : 'disabled'}.`);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Settings</h2>
      <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Enable Text Reviews</h3>
          <p className="text-gray-600 max-w-md">
            Allow users to submit a text-based review instead of just video and audio.
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
            allowTextReviews ? 'bg-orange-500' : 'bg-gray-200'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
              allowTextReviews ? 'translate-x-5' : 'translate-x-0'
            }`}
          ></span>
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;