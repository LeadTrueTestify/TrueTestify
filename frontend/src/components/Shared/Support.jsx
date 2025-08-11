const Support = () => (
  <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-200">
    <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Support & Help Center</h1>
    <p className="text-gray-600 text-center mb-12">
      Find answers to common questions or get in touch with our support team.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 border border-gray-200">
            <h3 className="font-bold text-lg text-gray-700">How do I embed the widget?</h3>
            <p className="text-gray-600 mt-2">
              You can find the shortcode and embed instructions in your dashboard under the "Widgets" section. Simply copy and paste the code into your website's HTML or CMS.
            </p>
          </div>
          <div className="bg-gray-50 p-4 border border-gray-200">
            <h3 className="font-bold text-lg text-gray-700">How do I moderate new reviews?</h3>
            <p className="text-gray-600 mt-2">
              All new reviews appear in your "Moderation" dashboard. You can approve or reject them with a single click before they are displayed publicly.
            </p>
          </div>
          <div className="bg-gray-50 p-4 border border-gray-200">
            <h3 className="font-bold text-lg text-gray-700">What if I need more storage?</h3>
            <p className="text-gray-600 mt-2">
              You can upgrade your subscription plan at any time from the "Manage Subscription" page in your dashboard to get more storage and features.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Support</h2>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Fill out the form below.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="support-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="support-email" className="mt-1 block w-full p-3 border border-gray-300 shadow-sm" />
          </div>
          <div>
            <label htmlFor="support-message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea id="support-message" rows="5" className="mt-1 block w-full p-3 border border-gray-300 shadow-sm"></textarea>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold tracking-wide hover:bg-blue-700 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </div>
);

export default Support;