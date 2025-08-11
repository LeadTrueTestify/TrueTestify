import { ArrowUpOnSquareStackIcon, MoonIcon, PuzzlePieceIcon, SunIcon } from "@heroicons/react/16/solid";
import PublicReviews from "../../pages/PublicReviews";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";

const WidgetSettings = () => {
  const {getInitialData} = useContext(AuthContext);
  const [widgetConfig, setWidgetConfig] = useState(getInitialData('widgetConfig', {
    layout: 'carousel',
    theme: 'light',
    autoplay: true,
    accentColor: '#ef7c00', // TrueTestify orange
  }));

  const handleConfigChange = (key, value) => {
    const newConfig = { ...widgetConfig, [key]: value };
    localStorage.setItem('widgetConfig', JSON.stringify(newConfig));
    setWidgetConfig(newConfig);
    toast.success('Widget settings updated!');
  };

  const layouts = [
    { name: 'Carousel', value: 'carousel' },
    { name: 'Grid', value: 'grid' },
    { name: 'Wall', value: 'wall' },
    { name: 'Spotlight', value: 'spotlight' },
  ];

  const themes = [
    { name: 'Light', value: 'light', icon: <SunIcon className="h-5 w-5" /> },
    { name: 'Dark', value: 'dark', icon: <MoonIcon className="h-5 w-5" /> },
  ];

  const { user } = useContext(AuthContext);

  const shortcode = `[truetestify_widget layout="${widgetConfig.layout}" theme="${widgetConfig.theme}"]`;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Widgets & Embeds</h2>
      <div className="bg-white p-6 shadow-sm border border-gray-200">
        {/* Mock Account Connection */}
        <div className="flex items-center justify-between p-4 mb-6 bg-green-50 text-green-800 border-l-4 border-green-500">
          <p className="font-semibold flex items-center">
            <PuzzlePieceIcon className="h-6 w-6 mr-2" />
            Connected to TrueTestify account: <span className="ml-2 font-bold">{user?.id}</span>
          </p>
          <button className="text-green-600 hover:underline">Disconnect</button>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Configure Your Widget</h3>
        <p className="text-gray-600 mb-6">
          Customize the appearance and behavior of your testimonial widget.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Widget Layout</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {layouts.map(layout => (
                <button
                  key={layout.value}
                  onClick={() => handleConfigChange('layout', layout.value)}
                  className={`px-4 py-3 font-semibold text-sm transition-colors border ${
                    widgetConfig.layout === layout.value ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {layout.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Widget Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map(theme => (
                <button
                  key={theme.value}
                  onClick={() => handleConfigChange('theme', theme.value)}
                  className={`flex items-center justify-center px-4 py-3 font-semibold text-sm transition-colors border ${
                    widgetConfig.theme === theme.value ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {theme.icon}
                  <span className="ml-2">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
          <label htmlFor="autoplay-toggle" className="text-sm font-medium text-gray-700">Autoplay Videos</label>
          <button
            onClick={() => handleConfigChange('autoplay', !widgetConfig.autoplay)}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              widgetConfig.autoplay ? 'bg-orange-500' : 'bg-gray-200'
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                widgetConfig.autoplay ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></span>
          </button>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Embed Your Widget</h3>
        <p className="text-gray-600 mb-4">
          Copy and paste this shortcode into any post or page in WordPress.
        </p>
        <div className="relative border border-gray-300">
          <input
            type="text"
            readOnly
            value={shortcode}
            className="w-full pl-3 pr-10 py-2 bg-gray-50 text-sm text-gray-700 font-mono focus:outline-none"
          />
          <button
            onClick={() => { navigator.clipboard.writeText(shortcode); toast.success('Shortcode copied!'); }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-orange-500"
          >
            <ArrowUpOnSquareStackIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mt-8 p-6 bg-gray-50 border border-gray-200">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Live Preview</h4>
          <div className="border border-gray-300 p-4">
            <p className="text-sm text-gray-500 mb-2">This is a live preview of how your widget would look with the current settings.</p>
            <PublicReviews isPreview={true} layout={widgetConfig.layout} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WidgetSettings