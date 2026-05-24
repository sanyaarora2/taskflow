import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {

  // Store current theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  /*
    Theme flow:
    1. User toggles dark mode
    2. Add/remove dark class globally
    3. Save selected theme in localStorage
    4. Persist theme after refresh
  */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

 return (
    <div className={darkMode ? 'dark' : ''}>
      <BrowserRouter>

        {/* All app routes */}
        <Routes>

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public routes */}
          <Route
            path="/login"
            element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />}
          />

          <Route
            path="/register"
            element={<Register darkMode={darkMode} setDarkMode={setDarkMode} />}
          />

          {/* Protected dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

/*
React Router DOM:

BrowserRouter:
- Enables routing in the app

Routes:
- Checks current URL and renders matching route

Route:
- Defines which component should render on a specific path

Navigate:
- Redirect user to another route automatically

ProtectedRoute:
- Checks authentication token
- If token missing -> redirect to login
- Else allow dashboard access
*/