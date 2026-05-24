import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Moon,
  Sun,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
} from "lucide-react";

import axiosInstance from "../utils/axios";

const Register = ({ darkMode, setDarkMode }) => {

  // Store form input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Terms & conditions checkbox state
  const [agree, setAgree] = useState(false);

  // Used for page navigation
  const navigate = useNavigate();

  /*
    Register flow:
    1. Send user data to backend
    2. Backend creates new account
    3. JWT token received
    4. Save token in localStorage
    5. Redirect user to dashboard
  */
  const handleRegister = async () => {

    try {

      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      // Save token after successful registration
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all duration-500 overflow-hidden">

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

      {/* Register Card */}
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-2xl">

        {/* Heading Section */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Join and start managing your tasks smarter 🚀
          </p>
        </div>

        {/* Name Input */}
        <div className="mb-5">

          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Full Name
          </label>

          <div className="relative">

            <User
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}

              // Controlled input
              onChange={(e) => setName(e.target.value)}

              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-5">

          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>

          <div className="relative">

            <Mail
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}

              // Update email state while typing
              onChange={(e) => setEmail(e.target.value)}

              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-5">

          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            Password
          </label>

          <div className="relative">

            <Lock
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}

              // Update password state while typing
              onChange={(e) => setPassword(e.target.value)}

              className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/50 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />

            {/* Password visibility toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center gap-2 mb-6">

          <input
            type="checkbox"
            checked={agree}

            // Toggle agreement state
            onChange={() => setAgree(!agree)}

            className="w-4 h-4 accent-purple-600"
          />

          <p className="text-sm text-gray-600 dark:text-gray-300">
            I agree to the terms & conditions
          </p>
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}

          // Disable button until checkbox is checked
          disabled={!agree}

          className={`w-full py-3 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300
          
          ${
            agree
              ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Create Account
        </button>

        {/* Login Redirect */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-300">

          Already have an account?

          <Link
            to="/login"
            className="ml-1 font-semibold text-pink-600 dark:text-pink-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

/*
Backend Register Flow:

1. Check whether user already exists
   → Prevent duplicate accounts

2. Hash password using bcrypt
   → Actual password should not be stored in DB

3. Save new user in database

4. Generate JWT token
   → Token acts like user's digital identity

5. Send token back to frontend
*/

/*
Frontend After Registration:

1. Save token in localStorage

2. Future authenticated requests use same token

3. User stays logged in after refresh
   → Because token already exists in browser storage
*/