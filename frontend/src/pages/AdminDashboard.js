import React from "react";
import DashboardLayout from "./DashboardLayout";
import VideoApprovals from "./VideoApprovals"; // Component for video approvals
import UserManagement from "./UserManagement"; // Admin's user management
import VideoWithMap from "./VideoWithMap"; // Import the new component for video and map
import DashboardNavbar from "../components/DashboardNavbar";
import StatsOverview from "./StatsOverview"; // Reusable Stats component
import ConsolidatedMap from "./ConsolidatedMap"; // Import the new component for consolidated map

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <DashboardNavbar />
      <div className="p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Admin Dashboard
        </h1>

        <div className="bg-gray-200 shadow-lg rounded-lg p-4 sm:p-6 mb-6">
          <StatsOverview />
        </div>

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
          <UserManagement role={"admin"}/>
        </div>

        {/* Consolidated Map */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ConsolidatedMap />
          {/* <VideoWithMap /> Render the VideoWithMap component here */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
