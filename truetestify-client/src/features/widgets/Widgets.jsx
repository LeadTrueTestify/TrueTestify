// import React from 'react'

const Widgets = () => {
  return (
    <>
      <div className="p-6 bg-blue-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          Flexible Widget Layouts
        </h1>
        <p className="text-gray-500 font-light">
          Choose the perfect display style for your website
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto py-11">
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">Grid</p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>Responsive grid of video testimonials</li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">Carousel</p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>Sliding testimonials with navigation</li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">Spotlight</p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>Single featured video testimonial</li>
            </ul>
            {/* <button className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
            Get Started
          </button> */}
          </div>
          <div className="rounded-xl shadow p-10 text-center border border-blue-200 bg-blue-300 hover:border-blue-600">
            {/* <h2 className="text-xl font-semibold mb-2"></h2> */}
            <p className="text-xl font-bold text-primary mb-4">Floating Bubble</p>
            <ul className="text-gray-600 space-y-2 mb-6">
              {/* <li>✓</li> */}
              <li>Fixed position review button</li>
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

export default Widgets;
