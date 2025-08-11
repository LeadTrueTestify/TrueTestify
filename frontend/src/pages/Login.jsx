import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Log In
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mb-2 space-x-2 py-3 px-4 bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-lg"
        >
          Log In
        </button>
      </form>
      <div className="space-y-4">
        <button
          onClick={() => handleLogin("shopify")}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-800 text-white font-bold tracking-wide hover:bg-gray-700 transition-colors"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/92/Shopify_logo.svg"
            alt="Shopify Logo"
            className="h-6"
          />
          <span>Connect with Shopify</span>
        </button>
        <button
          onClick={() => handleLogin("wordpress")}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 text-white font-bold tracking-wide hover:bg-blue-600 transition-colors"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/WordPress.svg"
            alt="WordPress Logo"
            className="h-6"
          />
          <span>Connect with WordPress</span>
        </button>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-orange-600 hover:text-orange-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
