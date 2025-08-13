import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import Settings from "./Settings";

const AdminSettings = () => {
  const { getInitialData, hasFeature } = useContext(AuthContext);
  const [allowTextReviews, setAllowTextReviews] = useState(getInitialData('allowTextReviews', false));

  const handleToggle = () => {
    const newSetting = !allowTextReviews;
    localStorage.setItem('allowTextReviews', JSON.stringify(newSetting));
    setAllowTextReviews(newSetting);
    toast.success(`Text reviews are now ${newSetting ? 'enabled' : 'disabled'}.`);
  };

  const [logoUrl, setLogoUrl] = useState(JSON.parse(localStorage.getItem('brandLogoUrl') || 'null'));
  const [primaryColor, setPrimaryColor] = useState(JSON.parse(localStorage.getItem('brandPrimaryColor') || '"#1f2937"'));
  const [showConsent, setShowConsent] = useState(JSON.parse(localStorage.getItem('showConsent') || 'true'));

  const saveBranding = () => {
    localStorage.setItem('brandLogoUrl', JSON.stringify(logoUrl || ''));
    localStorage.setItem('brandPrimaryColor', JSON.stringify(primaryColor || '#1f2937'));
    toast.success('Branding updated');
  };

  const saveConsent = () => {
    localStorage.setItem('showConsent', JSON.stringify(showConsent));
    toast.success('Consent preference saved');
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
          disabled={!hasFeature('advanced_moderation')}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
              allowTextReviews ? 'translate-x-5' : 'translate-x-0'
            }`}
          ></span>
        </button>
      </div>

      <div className="bg-white p-6 border border-gray-200 shadow-sm mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="border p-2" placeholder="Brand logo URL" value={logoUrl || ''} onChange={(e) => setLogoUrl(e.target.value)} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Primary Color</span>
            <input type="color" className="border p-1" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
          </div>
          <button onClick={saveBranding} className="px-4 py-2 bg-orange-500 text-white font-semibold hover:bg-orange-600">Save Branding</button>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 shadow-sm mt-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Require Consent Checkbox</h3>
          <p className="text-gray-600 max-w-md">Show consent confirmation before allowing a review submission.</p>
        </div>
        <button
          onClick={() => { setShowConsent(!showConsent); }}
          onBlur={saveConsent}
          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
            showConsent ? 'bg-orange-500' : 'bg-gray-200'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
              showConsent ? 'translate-x-5' : 'translate-x-0'
            }`}
          ></span>
        </button>
      </div>

      {!hasFeature('advanced_moderation') && (
        <p className="text-sm text-gray-500 mt-2">Upgrade to Pro to unlock advanced moderation settings.</p>
      )}
    </div>
  );
};

export default AdminSettings;