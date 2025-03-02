// AllUsers.js
import React from "react";
import UserManagement from "./UserManagement"; 
import DashboardLayout from "./DashboardLayout";
import DashboardNavbar from "../components/DashboardNavbar";

const AllUsers = (role) => {
  return (
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

export default AllUsers;


