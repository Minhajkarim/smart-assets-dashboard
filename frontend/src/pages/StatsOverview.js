import React from 'react';
import { FaUsers, FaUserShield, FaFileAlt } from 'react-icons/fa'; // Importing icons

const StatsOverview = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-extrabold text-white mb-6">System Stats Overview</h2>
      
      {/* Grid Layout for Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
        
        {/* Total Users */}
        <div className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center shadow-lg">
          <div className="p-3 bg-white rounded-full text-teal-500 mr-4">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold">Total Users</p>
            <p className="text-xl font-bold">100</p>
          </div>
        </div>

        {/* Active Admins */}
        <div className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center shadow-lg">
          <div className="p-3 bg-white rounded-full text-green-500 mr-4">
            <FaUserShield size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold">Active Admins</p>
            <p className="text-xl font-bold">10</p>
          </div>
        </div>

        {/* Reports Submitted */}
        <div className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center shadow-lg">
          <div className="p-3 bg-white rounded-full text-yellow-500 mr-4">
            <FaFileAlt size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold">Reports Submitted</p>
            <p className="text-xl font-bold">50</p>
          </div>
        </div>

      </div>

      {/* You can add more stats or data visualization here if needed */}
    </div>
  );
};

export default StatsOverview;
