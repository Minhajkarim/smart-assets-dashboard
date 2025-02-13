import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaFileAlt, FaCogs, FaBars, FaTimes, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

const Sidebar = ({ role, isOpen, toggleSidebar }) => {
  return (
    <motion.aside
      initial={{ width: "16rem" }}
      animate={{ width: isOpen ? "16rem" : "4rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-gray-900 text-white shadow-lg fixed top-0 left-0 flex flex-col p-4 transition-all duration-300 ease-in-out overflow-y-auto"
    >
      {/* Toggle Button */}
      <button
        className="text-white text-2xl absolute top-5 right-4"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Logo / Brand */}
      <div className="flex items-center space-x-3 mb-10 mt-8">
        <FaHome className="text-3xl text-teal-400" />
        {isOpen && <span className="text-xl font-bold">Smart Assets</span>}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-6">
        <SidebarLink to={getDashboardPath(role)} icon={<FaTachometerAlt />} text="Dashboard" isOpen={isOpen} />
        <SidebarLink to={getProfilePath(role)} icon={<FaUser />} text="Profile" isOpen={isOpen} />

        {/* User Sidebar Links */}
        {role === "user" && (
          <>
            <SidebarLink to="/resurveys" icon={<FaFileAlt />} text="View Resurveys" isOpen={isOpen} />
            <SidebarLink to="/submitted-videos" icon={<FaFileAlt />} text="Submitted Videos" isOpen={isOpen} />
          </>
        )}

        {/* Admin & Super Admin Sidebar Links */}
        {(role === "admin" || role === "superadmin") && (
          <>
            <SidebarLink to="/team-management" icon={<FaCogs />} text="Manage Team" isOpen={isOpen} />
            <SidebarLink to="/admin-settings" icon={<FaCogs />} text="Admin Settings" isOpen={isOpen} />
          </>
        )}

        {/* Super Admin Only */}
        {role === "superadmin" && (
          <SidebarLink to="/superadmin/all-users" icon={<FaCogs />} text="All Users" isOpen={isOpen} />
        )}
      </nav>
    </motion.aside>
  );
};

// Sidebar Link Component (Reusable)
const SidebarLink = ({ to, icon, text, isOpen }) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-4 text-lg font-medium hover:bg-teal-500 hover:text-white p-3 rounded-lg transition-all duration-300"
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

// Helper Functions for Role-Based Routing
const getDashboardPath = (role) => {
  if (role === "admin") return "/admin";
  if (role === "superadmin") return "/superadmin";
  return "/user"; // Default for user role
};

const getProfilePath = (role) => {
  if (role === "admin") return "/admin/profile";
  if (role === "superadmin") return "/superadmin/profile";
  return "/user/profile"; // Default for user role
};

export default Sidebar;
