import React from "react";
import DashboardLayout from "./DashboardLayout";
import LiveRecording from "./LiveRecording";
import RecentReports from "./RecentReports"; // Recent activities related to traffic detection
import DashboardNavbar from "../components/DashboardNavbar";

const UserDashboard = (userId) => {
  return (
    <DashboardLayout role="user">
      <DashboardNavbar />
      <div className="p-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        User Dashboard
      </h1>

      {/* Live Recording Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Live Recording</h2>
        <LiveRecording userId={userId}/>
      </div>

      {/* Recent Reports */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <RecentReports userId={userId}/>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
