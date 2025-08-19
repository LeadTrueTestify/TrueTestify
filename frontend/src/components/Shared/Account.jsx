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

const Account = ({ userInfo, business }) => {
  const { logout } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [toggle, setToggle] = useState(false);

  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto mt-10 mb-10 bg-white p-8 border border-gray-200 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Account</h2>
      <div className="space-y-4 text-left">
        {true ? (
          <>
            <button className="w-40">
              <WrenchScrewdriverIcon className="h-6 w-6 text-orange-500" />
            </button>
            <form onSubmit={""} className="space-y-6">
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
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      value={businessName}
                      placeholder="Enter your bussines name"
                      onChange={(e) => setBusinessName(e.target.value)}
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
