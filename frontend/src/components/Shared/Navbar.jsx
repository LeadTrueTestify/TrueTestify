import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  const navLinks = user
    ? user.role === "admin"
      ? [
          { name: "Dashboard", href: "/dashboard/moderation", isPrimary: true },
          { name: "Account", href: "/account", isPrimary: false },
        ]
      : [
          { name: "Review Recorder", href: "/record", isPrimary: false },
          { name: "Account", href: "/account", isPrimary: true },
        ]
    : [
        { name: "Log In", href: "/login", isPrimary: false },
        { name: "Get Started", href: "/signup", isPrimary: true },
      ];

  const mainNavLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <>
        {/* Main site navbar, not fixed to avoid conflict with the dashboard layout's fixed navbar */}

        <nav className="w-full bg-gray-900 text-white py-5 border-t border-gray-800 z-30">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <Link
              to="/"
              className="text-3xl font-extrabold text-gray-200 tracking-tight"
            >
              TrueTestify
            </Link>
            <div className="flex items-center space-x-6">
              {/* Desktop links */}
              {mainNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="hidden lg:block text-gray-100 font-medium hover:text-orange-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`hidden lg:block px-6 py-2 font-bold transition-colors ${
                    link.isPrimary
                      ? "text-white bg-orange-500 hover:bg-orange-600"
                      : "text-gray-100 border border-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <button
                  onClick={handleLogout}
                  className="hidden lg:block text-red-500 hover:text-red-700 transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                </button>
              )}
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-800"
              >
                <Bars3Icon className="h-8 w-8" />
              </button>
            </div>
          </div>
        </nav>
        {/* Mobile Menu Overlay for main site */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 w-full bg-gray-900 text-white z-50 p-6 flex flex-col"
            >
              <div className="flex justify-between items-center pb-6 border-b border-gray-700">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-extrabold"
                >
                  TrueTestify
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-8 w-8" />
                </button>
              </div>
              <nav className="flex-1 mt-8 space-y-6">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-3xl font-bold text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-3xl font-bold transition-colors ${
                      link.isPrimary
                        ? "text-orange-500 hover:text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-3xl font-bold text-red-500 hover:text-red-300 transition-colors"
                  >
                    Logout
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </>
  );
};

export default Navbar;
