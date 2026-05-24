import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

import axiosInstance from "../utils/axios";

const Login = ({ darkMode, setDarkMode }) => {

  // Store form input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Used for page navigation
  const navigate = useNavigate();

  /*
    Login flow:
    1. Send email + password to backend
    2. Backend verifies user
    3. JWT token received
    4. Save token in localStorage
    5. Redirect user to dashboard
  */
  const handleLogin = async () => {

    try {

      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Store token after successful login
      localStorage.setItem("token", res.data.token);

      // Redirect user to dashboard
      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      // Show backend error message
      alert(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all duration-500">

      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-5 right-5 p-3 rounded-full bg-white/30 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700 shadow-lg transition"
      >
        {darkMode ? (
          <Sun className="text-yellow-400" size={22} />
        ) : (
          <Moon className="text-gray-800" size={22} />
        )}
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-2xl">

        {/* Heading Section */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Login to continue managing your tasks
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-5">

          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}

            // Controlled input
            onChange={(e) => setEmail(e.target.value)}

            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">

          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}

            // Update password state while typing
            onChange={(e) => setPassword(e.target.value)}

            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end mb-6">

          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:scale-[1.02] hover:shadow-purple-500/30 transition-all duration-300"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">

          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700"></div>

          <p className="px-3 text-sm text-gray-500 dark:text-gray-400">
            OR
          </p>

          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* Google Login UI */}
        <button className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/40 text-gray-700 dark:text-white font-medium hover:bg-white/80 dark:hover:bg-gray-800 transition-all">
          Continue with Google
        </button>

        {/* Register Redirect */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">

          Don&apos;t have an account?

          <Link
            to="/register"
            className="ml-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;