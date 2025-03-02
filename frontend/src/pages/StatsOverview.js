import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { FaCar, FaBoxes } from 'react-icons/fa';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { GiMoneyStack } from 'react-icons/gi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import AdminManagement from './AdminManagement'; 
// ✅ Register required components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const StatsOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAdmins: 0,
    reportsSubmitted: 0,
    totalAssetCost: 0,
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/stat`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch stats");
      }
      data.totalKms = data.totalKms.toFixed(2);
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Stats Error", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  const detectedLabels = Object.keys(stats.detectedObjectsCount);
const detectedCounts = Object.values(stats.detectedObjectsCount);
const cracksCount = stats.cracksCount;
const holesCount = stats.holesCount;

  // Pie chart data
  const pieData = {
    labels: ["Road Cracks", "Potholes"],
    datasets: [
      {
        data: [
          cracksCount,
          holesCount,
        ],
        backgroundColor: ["#4CAF50", "#FF9800", ],
        hoverBackgroundColor: ["#45A049", "#FB8C00"],
      },
    ],
  };
  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white' // Set legend text color to white
        }
      }
    }
  };
  const barOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white' // Set legend text color to white
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white' // Set x-axis text color to white
        }
      },
      y: {
        ticks: {
          color: 'white' // Set y-axis text color to white
        }
      }
    }
  };
  

  const barData = {
    labels: [...detectedLabels],
    datasets: [
      {
        label: "Amount",
        data: [
          ...detectedCounts,
        ],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#F44336"],
        borderColor: ["#388E3C", "#F57C00", "#1976D2", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-extrabold text-white mb-6">System Stats Overview</h2>

      {/* Grid Layout for Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white">
        {/* Total Users */}
        <div className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center shadow-lg">
          <div className="p-3 bg-white rounded-full text-teal-500 mr-4">
            <FaCar size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold">Total Distance Covered</p>
            <p className="text-xl font-bold">{stats.totalKms} KMs</p>
          </div>
        </div>

        {/* Active Admins */}
        <div className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center shadow-lg">
          <div className="p-3 bg-white rounded-full text-green-500 mr-4">
            <FaBoxes size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold">Total Assets Detected</p>
            <p className="text-xl font-bold">{stats.totalAssetsCount}</p>
          </div>
        </div>

        {/* Repairs Estimate Budget */}
        <div className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center shadow-lg">
          <div className="p-3 bg-white rounded-full text-yellow-500 mr-4">
            <GiMoneyStack size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold">Repairs Estimate Budget</p>
            <p className="text-xl font-bold">0</p>
            {/* <p className="text-xl font-bold">{stats.reportsSubmitted}</p> */}
          </div>
        </div>

        {/* Total Asset Cost */}
        <div className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center shadow-lg">
          <div className="p-3 bg-white rounded-full text-red-500 mr-4">
            <BiMoneyWithdraw size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold">Total Asset Cost</p>
            {/* <p className="text-xl font-bold">{stats.totalAssetCost}</p> */}
            <p className="text-xl font-bold">0</p>
          </div>
        </div>
      </div>

      {/* Space */}
      <div className="h-6"></div>

      {/* add bar chart */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-white">


      <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-center">Object Assets</h3>
          <Bar data={barData} options={barOptions} />
        </div>

      </div>
      <div className="h-6"></div>

      {/* Pie Chart Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-white">
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg h-80 pb-12 justify-center flex-col items-center " style={{"display": "flex"}} >
          <h3 className="text-lg font-semibold text-center">Road Defects</h3>
          <Pie data={pieData} options={pieOptions} />
         
        </div>

        {/* <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
          <AdminManagement />

        </div> */}

         
      </div>


    </div>
  );
};

export default StatsOverview;
