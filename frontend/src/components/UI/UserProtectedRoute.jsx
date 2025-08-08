import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please log in to access this page.");
      navigate('/login');
    }
  }, [user, loading, navigate]);

  return loading || !user ? (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl text-gray-500">Loading...</p>
    </div>
  ) : (
    children
  );
};

export default UserProtectedRoute;