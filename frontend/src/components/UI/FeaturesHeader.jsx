import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import React from "react";

const FeaturesHeader = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-fuchsia-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              TrueTestify Features
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Video Testimonial Capture,Audio & Text Reviews,Audio & Text
              Reviews,Seamless Integrations,Advanced Moderation andIn-depth
              Analytics.
            </p>

            {/* Search Bar */}
            {/* <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesHeader;
