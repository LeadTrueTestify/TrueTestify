const Settings = () => {
  const widgetCode = `<script src="https://truetestify.com/embed/yourbusiness.js" data-layout="grid"></script>`;
  const iframeCode = `<iframe src="https://truetestify.com/embed/yourbusiness.html" frameborder="0" width="100%" height="500px"></iframe>`;

  const copyToClipboard = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toast.success('Code copied to clipboard!');
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Settings & Widgets</h2>
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Embeddable JS Widget</h3>
          <p className="text-gray-600 mb-4">Copy this code and paste it into your website's HTML to display your video testimonials.</p>
          <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm overflow-x-scroll flex justify-between items-start">
            <pre className="flex-1 whitespace-pre-wrap">{widgetCode}</pre>
            <button onClick={() => copyToClipboard(widgetCode)} className="ml-4 px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded-full text-xs font-bold transition-colors">
              Copy
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Iframe Option</h3>
          <p className="text-gray-600 mb-4">Use this option for more control over the widget's dimensions.</p>
          <div className="bg-gray-800 text-white p-4 rounded-lg font-mono text-sm overflow-x-scroll flex justify-between items-start">
            <pre className="flex-1 whitespace-pre-wrap">{iframeCode}</pre>
            <button onClick={() => copyToClipboard(iframeCode)} className="ml-4 px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded-full text-xs font-bold transition-colors">
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings