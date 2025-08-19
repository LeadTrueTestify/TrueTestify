import { ArrowUpOnSquareStackIcon, MoonIcon, PuzzlePieceIcon, SunIcon } from "@heroicons/react/16/solid";
import QRCode from "qrcode";
import PublicReviews from "../../pages/PublicReviews";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WidgetSettings = () => {
  const navigate = useNavigate();
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

  const { hasFeature } = useContext(AuthContext);

  const layouts = [
    { name: 'Carousel', value: 'carousel', feature: 'layout_carousel' },
    { name: 'Grid', value: 'grid', feature: 'layout_grid' },
    { name: 'Wall', value: 'wall', feature: 'layout_wall' },
    { name: 'Spotlight', value: 'spotlight', feature: 'layout_spotlight' },
  ];

  const themes = [
    { name: 'Light', value: 'light', icon: <SunIcon className="h-5 w-5" /> },
    { name: 'Dark', value: 'dark', icon: <MoonIcon className="h-5 w-5" /> },
  ];

  const { user } = useContext(AuthContext);

  const shortcode = `[truetestify_widget layout="${widgetConfig.layout}" theme="${widgetConfig.theme}"]`;
  const publicReviewBaseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const businessSlug = user?.publicReviewUrl || "your-business";  
  const publicRecordUrl = `${publicReviewBaseUrl}/record/${businessSlug}`;

  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const dataUrl = await QRCode.toDataURL(publicRecordUrl, { margin: 1, width: 256 });
        if (isMounted) setQrDataUrl(dataUrl);
      } catch (_) {
        // no-op; download will surface toast on failure
      }
    })();
    return () => { isMounted = false; };
  }, [publicRecordUrl]);

  const handleDownloadQr = async () => {
    try {
      const dataUrl = qrDataUrl || await QRCode.toDataURL(publicRecordUrl, { margin: 1, width: 512 });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `truetestify-record-${businessSlug}.png`;
      link.click();
      toast.success('QR code downloaded.');
    } catch (e) {
      toast.error('Failed to generate QR code');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Widgets & Embeds</h2>
      <div className="bg-white p-4 sm:p-6 shadow-sm border border-gray-200">
        {/* Mock Account Connection */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 mb-6 bg-green-50 text-green-800 border-l-4 border-green-500">
          <p className="font-semibold flex items-center">
            <PuzzlePieceIcon className="h-6 w-6 mr-2" />
            Connected to TrueTestify account: <span className="ml-2 font-bold">{user?.email}</span>
          </p>
          <button className="text-green-600 hover:underline">Disconnect</button>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4">1. Configure Your Widget</h3>
        <p className="text-gray-600 mb-6">
          Customize the appearance and behavior of your testimonial widget.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Widget Layout</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {layouts.map(layout => (
                <button
                  key={layout.value}
                  onClick={() => hasFeature(layout.feature) && handleConfigChange('layout', layout.value)}
                  disabled={!hasFeature(layout.feature)}
                  className={`px-4 py-3 font-semibold text-sm transition-colors border ${
                    widgetConfig.layout === layout.value ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  } ${!hasFeature(layout.feature) ? 'opacity-50 cursor-not-allowed' : ''}`}
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

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-300 p-3 sm:p-4">
            <p className="text-sm text-gray-500 mb-2">JavaScript Embed</p>
            <pre className="text-xs bg-gray-50 p-3 overflow-x-auto">{`<script src="https://cdn.truetestify.com/widget.js" data-layout="${widgetConfig.layout}" data-theme="${widgetConfig.theme}" data-business="${businessSlug}"></script>`}</pre>
          </div>
          <div className="border border-gray-300 p-3 sm:p-4">
            <p className="text-sm text-gray-500 mb-2">Iframe Embed</p>
            <pre className="text-xs bg-gray-50 p-3 overflow-x-auto">{`<iframe src="${publicReviewBaseUrl}/public-reviews/${businessSlug}" style="width:100%;height:420px;border:0;" loading="lazy"></iframe>`}</pre>
          </div>
        </div>

        <div className="text-center mt-8 p-4 sm:p-6 bg-gray-50 border border-gray-200">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Live Preview</h4>
          <div className="border border-gray-300 p-3 sm:p-4">
            <p className="text-sm text-gray-500 mb-2">This is a live preview of how your widget would look with the current settings.</p>
            <PublicReviews isPreview={true} layout={widgetConfig.layout} />
            {!hasFeature('widget_embed') && (
              <p className="mt-4 text-sm text-red-500">Widget embedding is not available on your current plan.</p>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 sm:p-6 bg-white border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">WordPress & Shopify</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="border border-gray-200 p-3 sm:p-4">
              <h4 className="font-semibold mb-2">WordPress Plugin</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Install “TrueTestify – Testimonials”</li>
                <li>Connect your account</li>
                <li>Use shortcode: <code className="bg-gray-100 px-1">[truetestify_widget type="{widgetConfig.layout}"]</code></li>
              </ul>
              <a href="https://truetestify.com" target="_blank" className="inline-block mt-3 text-orange-600 hover:underline">Open Dashboard</a>
            </div>
            <div className="border border-gray-200 p-3 sm:p-4">
              <h4 className="font-semibold mb-2">Shopify App</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Install “TrueTestify – Video Testimonials”</li>
                <li>Connect your store</li>
                <li>Choose placement: Home, Product, Floating</li>
              </ul>
              <a href="https://truetestify.com" target="_blank" className="inline-block mt-3 text-orange-600 hover:underline">Open Dashboard</a>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Offline Collection QR</h3>
        <p className="text-gray-600 mb-4">
          Print this QR on packaging, receipts, or displays. Scanning redirects customers to your public review page where they can submit a review.
        </p>
        <div className="flex flex-col items-center gap-4 p-4 sm:p-6 bg-white border border-gray-200">
          <p className="text-sm text-gray-600">Target URL: <span className="font-mono break-all">{publicRecordUrl}</span></p>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Record review QR" className="w-48 h-48 border border-gray-200" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center border border-dashed border-gray-300 text-gray-400 text-sm">Generating…</div>
          )}
          <button onClick={handleDownloadQr} className="px-6 py-2 bg-orange-500 text-white font-semibold hover:bg-orange-600">Download QR Code</button>
          <button onClick={()=> navigate(`/record/${businessSlug}`)} className="px-6 py-2 bg-orange-500 text-white font-semibold hover:bg-orange-600">Leave Review</button>
        </div>
      </div>
    </div>
  );
};
export default WidgetSettings