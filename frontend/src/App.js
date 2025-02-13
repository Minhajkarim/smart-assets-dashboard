import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom"; // Ensure correct import
import { jwtDecode } from "jwt-decode"; // Correct import

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Resurveys from "./pages/Resurveys"; // Added resurveys page
import Videos from "./pages/Videos"; // Added submitted videos page

function Layout() {
  const [userRole, setUserRole] = useState(null); // Store the role from token
  const [loading, setLoading] = useState(true); // To handle async loading
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Failed to decode token", error);
        setUserRole(null);
      }
    }
    setLoading(false);
  }, []);

  // Prevent routing until user role is loaded
  if (loading) return <div>Loading...</div>;

  // Hide Navbar for dashboard pages
  const hideNavbar = location.pathname.startsWith("/admin") || location.pathname.startsWith("/user") || location.pathname.startsWith("/superadmin");

  return (
    <>
      {/* Hide Navbar on Dashboard pages */}
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/services" element={<Services />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard Routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/superadmin/*" element={<SuperAdminDashboard />} />

        {/* User Dashboard with Nested Routes */}
        <Route path="/user/*" element={<UserDashboard />} />

        {/* Profile Routes */}
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/superadmin/profile" element={<Profile />} />

        {/* User-Specific Pages */}
        <Route path="/resurveys" element={<Resurveys />} />
        <Route path="/submitted-videos" element={<Videos />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
