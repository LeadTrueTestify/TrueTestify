import { CogIcon, UserIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const Account = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-200 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Account</h2>
      <div className="space-y-4 text-left">
        <div className="flex items-center space-x-3 bg-gray-50 p-4 border border-gray-200">
          <UserIcon className="h-6 w-6 text-orange-500" />
          <p className="text-gray-700">Account ID: <span className="font-semibold">{user?.id}</span></p>
        </div>
        <div className="flex items-center space-x-3 bg-gray-50 p-4 border border-gray-200">
          <CogIcon className="h-6 w-6 text-orange-500" />
          <p className="text-gray-700">Role: <span className="font-semibold">{user?.role}</span></p>
        </div>
      </div>
      <button onClick={() => { logout(); navigate('/'); }} className="mt-8 w-full py-3 bg-red-600 text-white font-bold tracking-wide transition-colors hover:bg-red-700">
        Logout
      </button>
    </div>
  );
};

export default Account