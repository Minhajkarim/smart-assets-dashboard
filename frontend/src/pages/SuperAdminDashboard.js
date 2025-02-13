import React from "react";
import DashboardLayout from "./DashboardLayout";
import StatsOverview from "./StatsOverview"; // Reusable Stats component
import AdminManagement from "./AdminManagement"; // Admin-specific feature component
import SystemConfig from "./SystemConfig"; // System config component
import DashboardNavbar from "../components/DashboardNavbar";

const SuperAdminDashboard = () => {
  return (
    <DashboardLayout role="superadmin">
      <DashboardNavbar />
      <div className="p-4 sm:p-6 md:p-8"> {/* Responsive padding */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Super Admin Dashboard
        </h1>

        {/* Overview of Stats */}
        <div className="bg-gray-200 shadow-lg rounded-lg p-4 sm:p-6 mb-6">
          <StatsOverview />
        </div>

        {/* Management Components */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Admin Management */}
          <div className="bg-gray-200 shadow-lg rounded-lg p-4 sm:p-6 transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
            <AdminManagement />
          </div>

          {/* System Config */}
          <div className="bg-gray-200 shadow-lg rounded-lg p-4 sm:p-6 transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
            <SystemConfig />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
