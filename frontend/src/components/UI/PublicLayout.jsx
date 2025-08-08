import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Shared/Navbar";
import FloatingReviewWidget from "../Dashboard/FloatingReviewWidget";

const PublicLayout = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  return (
    <div className="container mx-auto p-4 md:p-0">
      <Navbar />
      <Outlet />
      {!isDashboard && <FloatingReviewWidget />}
    </div>
  );
};

export default PublicLayout;
