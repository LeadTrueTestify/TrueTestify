import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import BusinessPage from "./pages/BusinessPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignupPage from "./pages/SignupPage";
import { useContext } from "react";
import { UserContext } from "./context/UserContex";
import PublicReviewPage from "./pages/PublicReviewPage";
import PageNotFound from "./pages/PageNotFound";

function App() {
  // const navigate = useNavigate()
  const { user } = useContext(UserContext);
  // console.log(user);
  // ROOT ELEMENT
  // const Root = ()=>{
  //   // Check Token
  //   const isAuthenticated = !!localStorage.getItem("token")

  //   // Redirect The Location
  //   return isAuthenticated ?( <Navigate to='/dashboard'/> ): (<Navigate to='/login' />)

  // }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/public/review/:slug" element={<PublicReviewPage />} />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <LoginPage />}
        />
        <Route
          path="/business/:slug"
          element={user ? <BusinessPage /> : <LoginPage />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
