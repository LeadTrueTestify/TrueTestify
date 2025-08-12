const Contact = () => (
  <div className="p-8 my-2 mt-5 bg-white border border-gray-200 max-w-2xl mx-auto">
    <h2 className="text-5xl font-extrabold text-gray-800 text-center mb-8">Contact Us</h2>
    <p className="text-center text-lg text-gray-600 mb-8">
      We're here to help! Fill out the form below and we'll get back to you as soon as possible.
    </p>
    <form className="space-y-6 text-start">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 ">Name</label>
        <input type="text" id="name" name="name" className="mt-1 block w-full p-3 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="email" name="email" className="mt-1 block w-full p-3 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea id="message" name="message" rows="4" className="mt-1 block w-full p-3 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-bold tracking-wide transition-colors hover:bg-blue-700"
        >
          Send Message
        </button>
      </div>
    </form>
  </div>
);

export default Contact