import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { UserIcon, UserPlusIcon } from "@heroicons/react/16/solid";
import axiosInstance from "../utils/axiosInstanse";
import { API_PATHS } from "../utils/apiPaths";
import { validateEmail } from "../utils/helper";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  // const [tenantName,setTenantName] = useState();
  const [role, setRole] = useState("reviewer"); // State for selected role
  const [tenantName, setTenantName] = useState(""); // NEW: State for business name
  const [publicReviewUrl, setPublicReviewUrl] = useState(""); // NEW: State for the public URL slug

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // NEW: Function to sanitize the business name for a URL
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  // NEW: Update the public review URL whenever the business name changes
  useEffect(() => {
    if (role === "admin") {
      const slug = slugify(tenantName);
      setPublicReviewUrl(slug);
    } else {
      setPublicReviewUrl("");
    }
  }, [tenantName, role]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Check Email Condition
    if (!validateEmail(email)) {
      setError("Plase enter a valid Email.");
      return;
    }

    // Check Password Condition
    if (!password) {
      setError("Plase Enter Password.");
      return;
    }

    // Check Name Condition
    if (!name) {
      setError("Plase Enter Name.");
      return;
    }
    if (!tenantName) {
      setError("Plase Enter Tenant Name.");
      return;
    }
    setError("");

    // Signup API Call
    try {
      // if (profilePic) {
      //   const imgUploadRes = await uploadImage(profilePic);
      //   profileImageUrl = imgUploadRes.imageUrl || "";
      // }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGSITER, {
        name,
        email,
        password,
        tenantName,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user)
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Someting went Wronge. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Sign Up
      </h2>
      <p className="text-gray-600 mb-8">
        Choose your account type to get started.
      </p>
      <form onSubmit={handleSignUp} className="space-y-6">
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`flex-1 flex flex-col items-center p-6 border-2 transition-colors ${
              role === "admin"
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <UserIcon className="h-10 w-10 mb-2" />
            <span className="font-bold">Admin</span>
            <p className="text-sm text-center mt-1">
              For business owners to manage reviews.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setRole("reviewer")}
            className={`flex-1 flex flex-col items-center p-6 border-2 transition-colors ${
              role === "reviewer"
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <UserPlusIcon className="h-10 w-10 mb-2" />
            <span className="font-bold">Reviewer</span>
            <p className="text-sm text-center mt-1">
              For customers to submit a review.
            </p>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block  text-sm font-medium text-gray-700">
              Email Address
            </label>
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
            <label className="block  text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              className="mt-1 py-2 block w-full rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
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
            <label className="block  text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 py-2 block w-full rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>
          {/* NEW: Conditional form fields for Admin role */}
          {role === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label
                  htmlFor="tenantName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="tenantName"
                  value={tenantName}
                  placeholder="Enter your bussines name"
                  onChange={(e) => setTenantName(e.target.value)}
                  className="mt-1 block w-full py-2 rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required={role === "admin"}
                />
              </div>
              <div>
                <label
                  htmlFor="publicReviewUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Public Review URL
                </label>
                <div className="mt-1 flex items-center">
                  <span className="bg-gray-200 text-gray-600 text-sm py-2 px-3 rounded-l-md border border-gray-400 border-r-0">
                    /
                  </span>
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
                  <p className="mt-2 text-xs text-gray-500">
                    Your public review page will be at `/{publicReviewUrl}`.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-orange-500 text-white font-bold tracking-wide hover:bg-orange-600 transition-colors"
        >
          Create Account
        </button>
        {error && <p className="text-red-500 pb-2.5 text-xs">{error}</p>}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-orange-600 hover:text-orange-500"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
