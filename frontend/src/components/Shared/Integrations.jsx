const Integrations = () => (
  <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-200">
    <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Seamless Integrations</h1>
    <p className="text-gray-600 text-center mb-12">
      Connect TrueTestify with the tools you already use to automate your workflow.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-50 p-6 border border-gray-200 flex flex-col items-center text-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/WordPress.svg" alt="WordPress Logo" className="h-16 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">WordPress Plugin</h3>
        <p className="text-gray-600">
          Easily install our official WordPress plugin to add testimonials to any post or page with a simple shortcode.
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
          Learn More
        </button>
      </div>

      <div className="bg-gray-50 p-6 border border-gray-200 flex flex-col items-center text-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/92/Shopify_logo.svg" alt="Shopify Logo" className="h-16 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Shopify App</h3>
        <p className="text-gray-600">
          Drive sales with social proof by embedding your best video and text reviews directly on your product pages.
        </p>
        <button className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
          Get the App
        </button>
      </div>
    </div>
  </div>
);

export default Integrations