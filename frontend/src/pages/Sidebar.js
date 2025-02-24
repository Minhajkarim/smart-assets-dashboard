import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaFileAlt, FaCogs, FaBars, FaTimes, FaHome, FaMap, FaImages, FaVideo } from "react-icons/fa";
import { motion } from "framer-motion";

const Sidebar = ({ role, isOpen, toggleSidebar }) => {
  const location = useLocation(); // Get current route to highlight active tab

  return (
    <motion.aside
      initial={{ width: "16rem" }}
      animate={{ width: isOpen ? "16rem" : "4rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-gray-900 text-white shadow-lg fixed top-0 left-0 flex flex-col p-4 transition-all duration-300 ease-in-out overflow-y-auto"
    >
      {/* Toggle Button */}
      <button className="text-white text-2xl absolute top-5 right-4" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Logo / Brand */}
      <div className="flex items-center space-x-3 mb-10 mt-8">
        <FaHome className="text-3xl text-teal-400" />
        {isOpen && <span className="text-xl font-bold">Smart Assets</span>}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-6">
        <SidebarLink to={getDashboardPath(role)} icon={<FaTachometerAlt />} text="Dashboard" isOpen={isOpen} active={location.pathname === getDashboardPath(role)} />
        <SidebarLink to={getProfilePath(role)} icon={<FaUser />} text="Profile" isOpen={isOpen} active={location.pathname === getProfilePath(role)} />

        {/* New Sidebar Tabs */}
        <SidebarLink to="/output-video" icon={<FaVideo />} text="Output Video" isOpen={isOpen} active={location.pathname === "/output-video"} />
        <SidebarLink to="/user/charts" icon={<FaMap />} text="Charts" isOpen={isOpen} active={location.pathname === "/user/charts"} />
        <SidebarLink to="/map" icon={<FaMap />} text="Map" isOpen={isOpen} active={location.pathname === "/map"} />
        <SidebarLink to="/user/report" icon={<FaFileAlt />} text="Report" isOpen={isOpen} active={location.pathname === "/report"} />
        <SidebarLink to="/images" icon={<FaImages />} text="Images" isOpen={isOpen} active={location.pathname === "/images"} />

        {/* User Sidebar Links */}
        {role === "user" && (
          <>
            <SidebarLink to="/user/resurveys" icon={<FaFileAlt />} text="View Resurveys" isOpen={isOpen} active={location.pathname === "/user/resurveys"} />
            <SidebarLink to="/user/submitted-videos" icon={<FaFileAlt />} text="Submitted Videos" isOpen={isOpen} active={location.pathname === "/user/submitted-videos"} />
          </>
        )}

        {/* Admin Sidebar Links */}
        {role === "admin" && (
          <SidebarLink to="/admin/team-management" icon={<FaCogs />} text="Manage Team" isOpen={isOpen} active={location.pathname === "/admin/team-management"} />
        )}

        {/* Super Admin Sidebar Links */}
        {role === "superadmin" && (
          <SidebarLink to="/superadmin/team-management" icon={<FaCogs />} text="Manage Team" isOpen={isOpen} active={location.pathname === "/superadmin/team-management"} />
        )}
      </nav>
    </motion.aside>
  );
};

// Sidebar Link Component (Reusable)
const SidebarLink = ({ to, icon, text, isOpen, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-4 text-lg font-medium p-3 rounded-lg transition-all duration-300 ${
        active ? "bg-teal-500 text-white" : "hover:bg-teal-500 hover:text-white"
      }`}
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
