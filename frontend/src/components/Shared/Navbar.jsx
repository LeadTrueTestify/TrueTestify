import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md rounded-lg p-4 mb-8 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        TrueTestify
      </Link>
      <div className="space-x-4">
        <Link to="/yourbusiness" className="text-blue-600 hover:text-blue-500">
          Public Page
        </Link>
        <Link to="/record" className="text-blue-600 hover:text-blue-500">
          Leave a Review
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
