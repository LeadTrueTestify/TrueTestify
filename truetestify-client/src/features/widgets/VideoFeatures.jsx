// import React from 'react'

const VideoFeatures = () => {
  return (
    <>
      <div className="p-6 border border-blue-200 bg-blue-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          Video-First Features
        </h1>
        <p className="text-gray-500 font-light">
          Everything you need to collect and showcase authentic video
          testimonials
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto py-11">
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2">Video-Only by Design</h2> */}
            <p className="text-xl font-bold text-primary mb-4">
              Video-Only by Design
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>
                Faces build trust more than stars and text ever could. 60-second
                authentic testimonials.
              </li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">
              60-Second Collection
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>
                Record or upload directly in browser. Auto-compressed to 720p
                for fast loading.
              </li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">
              Public Review Pages
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>
                Beautiful hosted pages at truetestify.com/yourbusiness with your
                branding.
              </li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">
              Embeddable Widgets
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>
                Grid, carousel, spotlight, and floating bubble layouts. Script
                or iframe embed.
              </li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">
              Privacy Compliant
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>
                GDPR/CCPA compliant with consent checkboxes and
                right-to-deletion support.
              </li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">
              Storage-Based Billing
            </p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>
                Pay only for what you store. Transparent GB-based pricing with
                Stripe integration.
              </li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoFeatures;
