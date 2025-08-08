import  { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/16/solid";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const publicPageUrl =
    user?.role === "admin" && user.publicReviewUrl
      ? `/${user.publicReviewUrl}`
      : "/yourbusiness";
  return (
    <nav className="bg-white shadow-md rounded-lg p-4  flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        TrueTestify
      </Link>
      <div className="flex space-x-4 items-center">
        <Link to={publicPageUrl} className="text-blue-600 hover:text-blue-500">
          Public Page
        </Link>
        <Link to="/pricing" className="text-blue-600 hover:text-blue-500">
          Pricing
        </Link>
        <Link to="/record" className="text-blue-600 hover:text-blue-500">
          Leave a Review
        </Link>
        {user ? (
          <>
            {user.role === "admin" && (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
