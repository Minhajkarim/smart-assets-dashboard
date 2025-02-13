import React, { useState, useEffect } from "react";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // ✅ Parse the stored user object
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    navigate("/signin");
  };

  return (
    <nav className="bg-gray-900 shadow-md px-6 py-4 flex items-center justify-between relative">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 w-full max-w-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-6 h-6 text-white hover:text-gray-400" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg p-2">
              <p className="text-sm text-gray-700">🔔 You have 3 new notifications</p>
              <ul className="mt-2 text-gray-600 text-sm">
                <li className="p-2 hover:bg-gray-100 cursor-pointer">New user signed up</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">Server maintenance at 3 PM</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer">New video submitted for review</li>
              </ul>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center space-x-2"
            onClick={() => setShowProfile(!showProfile)}
          >
            <User className="w-6 h-6 text-white hover:text-gray-400" />
            <span className="text-white font-medium">
              {user ? user.name : "Guest"}
            </span>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg p-2">
              <ul className="text-gray-600 text-sm">
                <li className="p-2 hover:bg-gray-100 cursor-pointer flex items-center">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </li>
                <li 
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
