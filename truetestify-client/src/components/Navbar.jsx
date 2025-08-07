import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import PageNotFound from "../pages/PageNotFound";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const businessName = localStorage.getItem("businessName");
  
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          Truetestify
        </Link>
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 focus:outline-none"
          >
            ☰
          </button>
        </div>
        <div
          className={`space-x-4 md:flex ${
            menuOpen ? "block" : "hidden"
          } md:block`}
        >
          <Link
            to="/"
            className="block py-2 md:inline text-gray-700 hover:text-primary"
          >
            Home
          </Link>
          <Link
            to={`/public/review/${businessName}`}
            className="block py-2 md:inline text-gray-700 hover:text-primary"
          >
            Public Review
          </Link>
          <Link
            to="/pricing"
            className="block py-2 md:inline text-gray-700 hover:text-primary"
          >
            Pricing
          </Link>
          <Link
            to="/dashboard"
            className="block py-2 md:inline text-gray-700 hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            to="/login"
            className="block md:inline text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
