import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { FaMapMarkerAlt, FaCubes, FaSearch, FaCoins } from "react-icons/fa";
import DashboardNavbar from "../components/DashboardNavbar";

const ChartsGraphs = () => {
  // Sample Data
  const stats = {
    distanceCovered: "3.29 KM",
    totalAssets: 236,
    estimatedBudget: 0,
    totalCost: 0,
  };

  const roadObjectsData = [
    { name: "Traffic Signal", count: 50 },
    { name: "Street Light", count: 60 },
    { name: "Tree", count: 40 },
    { name: "Stop Sign", count: 10 },
    { name: "U-turn Sign", count: 5 },
    { name: "Hazard Marker", count: 8 },
  ];

  const roadDefectsData = [
    { name: "Road Cracks", value: 98.3, color: "#0088FE" },
    { name: "Potholes", value: 1.7, color: "#00C49F" },
  ];

  const transactions = {
    submitted: 236,
    approved: 236,
    rejected: 0,
    cancelled: 0,
  };

  return (
    <div className="p-6">
        <DashboardNavbar />
      <h2 className="text-2xl font-bold mb-4">Charts & Graphs</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={<FaMapMarkerAlt />} title="Total Distance Covered" value={stats.distanceCovered} />
        <StatCard icon={<FaCubes />} title="Total Assets Detected" value={stats.totalAssets} />
        <StatCard icon={<FaSearch />} title="Repair's Estimated Budget" value={stats.estimatedBudget} />
        <StatCard icon={<FaCoins />} title="Total Asset/Object Cost" value={stats.totalCost} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Road Objects/Assets</h3>
          <BarChart width={500} height={300} data={roadObjectsData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0088FE" />
          </BarChart>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Road Defects</h3>
          <PieChart width={300} height={300}>
            <Pie data={roadDefectsData} dataKey="value" outerRadius={100} label>
              {roadDefectsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">Your Transactions</h3>
        <ul>
          <li>Submitted: {transactions.submitted}</li>
          <li>Approved: {transactions.approved}</li>
          <li>Rejected: {transactions.rejected}</li>
          <li>Cancelled: {transactions.cancelled}</li>
        </ul>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
      <div className="text-3xl text-blue-500">{icon}</div>
      <div>
        <p className="text-gray-600">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default ChartsGraphs;
