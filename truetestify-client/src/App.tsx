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

function App() {
  const {user} =useContext(UserContext)
  console.log(user);
  
  return (
    <> 
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={user ?<DashboardPage />:<LoginPage/>} />
        <Route path="/business/:slug" element={<BusinessPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
