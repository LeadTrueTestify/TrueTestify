import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      toast.error("You do not have permission to view this page.");
      navigate('/');
    }
  }, [user, loading, navigate]);

  return loading || !user || user.role !== 'admin' ? (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl text-gray-500">Loading...</p>
    </div>
  ) : (
    children
  );
};

export default AdminProtectedRoute;