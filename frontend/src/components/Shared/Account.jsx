import {
  CogIcon,
  ShieldCheckIcon,
  SwatchIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../utils/axiosInstanse";
import { API_PATHS } from "../../utils/apiPaths";

const Account = ({ userInfo, business }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editMode, setEditMode] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // TOGGLE EDIT MODE
  const editToggle = () => {
    setEditMode(!editMode);
  };
  //  UPDATE SUBMIT HANLDER
  const handleUpdate = async (e) => {
    e.preventDefault();

    // UPDATE TENANTS API Call
    try {
      await axiosInstance.patch(API_PATHS.TANANTS.UPDATE_TENANTS(business?.id), {
        name,
        slug,
      });
      setEditMode(false)
    } catch (error) {
      if (error.response && error.response.data.message) {
        // setError(error.response.data.message);
      } else {
        setError("Someting went Wronge. Please try again.");
      }
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 mb-10 bg-white p-8 border border-gray-200 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Account</h2>
      <div className="space-y-4 text-left">
        <button className="w-20 flex items-center gap-1" onClick={editToggle}>
          <span className="font-semibold">Edit</span>
          <WrenchScrewdriverIcon className="h-4 w-4 text-orange-500" />
        </button>
        {editMode ? (
          <>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex justify-center space-x-4">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 pt-4 border-t border-gray-200"
                >
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 border border-gray-200">
                    <label className="block  text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      placeholder="Enter Name"
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 pl-1 py-2 block w-full rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 border border-gray-200">
                    <label
                      htmlFor="slug"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="slug"
                      value={slug}
                      placeholder="Enter your bussines name"
                      onChange={(e) => setSlug(e.target.value)}
                      className="mt-1 pl-1 block w-full py-2 rounded-md border-gray-400 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </motion.div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-orange-500 text-white font-bold tracking-wide hover:bg-orange-600 transition-colors"
              >
                Update
              </button>
              {/* {error && <p className="text-red-500 pb-2.5 text-xs">{error}</p>} */}
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-3 bg-gray-50 p-4 border border-gray-200">
              <UserIcon className="h-6 w-6 text-orange-500" />
              <p className="text-gray-700">
                Name: <span className="font-semibold">{business?.name}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 p-4 border border-gray-200">
              <ShieldCheckIcon className="h-6 w-6 text-orange-500" />
              <p className="text-gray-700">
                Business Name:{" "}
                <span className="font-semibold">{business?.slug}</span>
              </p>
            </div>
          </>
        )}
        <div className="flex items-center space-x-3 bg-gray-50 p-4 border border-gray-200">
          <CogIcon className="h-6 w-6 text-orange-500" />
          <p className="text-gray-700">
            Account ID: <span className="font-semibold">{userInfo?.email}</span>
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="mt-8 w-full py-3 bg-red-600 text-white font-bold tracking-wide transition-colors hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Account;
