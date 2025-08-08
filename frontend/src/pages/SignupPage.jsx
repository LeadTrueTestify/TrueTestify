import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {motion} from "framer-motion"

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('reviewer'); // State for selected role
  const [businessName, setBusinessName] = useState(''); // NEW: State for business name
  const [publicReviewUrl, setPublicReviewUrl] = useState(''); // NEW: State for the public URL slug
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  // NEW: Function to sanitize the business name for a URL
  const slugify = (text) => {
    return text.toString().toLowerCase()
        .trim()
        .replace(/\s+/g, '-')         // Replace spaces with -
        .replace(/[^\w-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')            // Trim - from start of text
        .replace(/-+$/, '');           // Trim - from end of text
  };

  // NEW: Update the public review URL whenever the business name changes
  useEffect(() => {
    if (role === 'admin') {
      const slug = slugify(businessName);
      setPublicReviewUrl(slug);
    } else {
      setPublicReviewUrl('');
    }
  }, [businessName, role]);

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    // UPDATED: Pass the selected role, businessName, and publicReviewUrl to the signup function
    signup(email, password, role, businessName, publicReviewUrl);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block  text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 py-2 block w-full rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 py-2 block w-full rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block  text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 py-2 block w-full rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        
        <div className="mt-4">
          <span className="block text-sm font-medium text-gray-700">Choose your role:</span>
          <div className="mt-2 flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="reviewer"
                checked={role === 'reviewer'}
                onChange={(e) => setRole(e.target.value)}
                className="form-radio  text-blue-600 h-4 w-4"
              />
              <span className="ml-2 text-gray-700">Reviewer</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value)}
                className="form-radio text-blue-600 h-4 w-4"
              />
              <span className="ml-2 text-gray-700">Admin</span>
            </label>
          </div>
        </div>
        
        {/* NEW: Conditional form fields for Admin role */}
        {role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-4 border-t border-gray-200"
          >
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                placeholder="Enter your bussines name"
                onChange={(e) => setBusinessName(e.target.value)}
                className="mt-1 block w-full py-2 rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required={role === 'admin'}
              />
            </div>
            <div>
              <label htmlFor="publicReviewUrl" className="block text-sm font-medium text-gray-700">Public Review URL</label>
              <div className="mt-1 flex items-center">
                  <span className="bg-gray-200 text-gray-600 text-sm py-2 px-3 rounded-l-md border border-gray-400 border-r-0">/</span>
                  <input
                      type="text"
                      id="publicReviewUrl"
                      value={publicReviewUrl}
                      readOnly
                      placeholder="URL"
                      className="flex-grow px-3 py-2 border border-gray-400 rounded-r-md bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
                  />
              </div>
              {publicReviewUrl.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">Your public review page will be at `/{publicReviewUrl}`.</p>
              )}
            </div>
          </motion.div>
        )}
        
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-lg"
        >
          Sign Up
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage