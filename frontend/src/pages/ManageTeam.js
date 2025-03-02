// ManageTeam.js
import React from "react";
import UserManagement from "./UserManagement"; 
import DashboardLayout from "./DashboardLayout";
import DashboardNavbar from "../components/DashboardNavbar";
const ManageTeam = ({role}) => {
  return (
    // <div className="min-h-screen bg-gray-900 text-white p-6">
    //   <h1 className="text-4xl font-bold text-center mb-8">Manage Team</h1>
    //   <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    //     <h2 className="text-2xl font-semibold mb-4">Team Management</h2>
    //     {/* Admin can manage team members here */}
    //   </div>
    // </div>
    <DashboardLayout role={role}>
      <DashboardNavbar />
      <div className="p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Manage Team
        </h1>
        <div className="bg-gray-900 shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Team Management
          </h2>
          <UserManagement role={role}/>
        </div>
      </div>
    </DashboardLayout>);
};

export default ManageTeam;
