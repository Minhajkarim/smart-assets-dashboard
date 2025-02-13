import React from "react";
import DashboardLayout from "./DashboardLayout";
import VideoApprovals from "./VideoApprovals"; // Component for video approvals
import UserManagement from "./UserManagement"; // Admin's user management
import VideoWithMap from "./VideoWithMap"; // Import the new component for video and map
import DashboardNavbar from "../components/DashboardNavbar";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <DashboardNavbar />
      <div className="p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Video Approvals */}
        <div className="bg-gray-900 shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Pending Video Approvals
          </h2>
          <VideoApprovals />
        </div>

        {/* User Management */}
        <div className="bg-gray-900 shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold text-white mb-4">
            User Management
          </h2>
          <UserManagement />
        </div>

        {/* Video with Map Viewer */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Video Playback with Object Detection
          </h2>
          <VideoWithMap /> {/* Render the VideoWithMap component here */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
