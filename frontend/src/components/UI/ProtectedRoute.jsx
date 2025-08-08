import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(role))) {
      toast.error("You do not have permission to view this page.");
      navigate('/');
    }
  }, [user, role, loading, navigate, allowedRoles]);

  return loading || !user || !allowedRoles.includes(role) ? (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl text-gray-500">Loading...</p>
    </div>
  ) : (
    children
  );
};

export default ProtectedRoute