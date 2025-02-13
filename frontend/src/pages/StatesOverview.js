import React from "react";

const StatsOverview = () => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Total Users</h3>
        <p className="text-3xl mt-2">1200</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Videos Processed</h3>
        <p className="text-3xl mt-2">450</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Traffic Signs Detected</h3>
        <p className="text-3xl mt-2">3000+</p>
      </div>
    </div>
  );
};

export default StatsOverview;
