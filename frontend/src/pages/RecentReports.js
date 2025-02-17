import React, { useEffect, useState } from "react";



// const videoReports = [
//   { id: 1, name: "Survey Area A", status: "Pending" },
//   { id: 2, name: "Bridge Inspection", status: "Approved" },
//   { id: 3, name: "Highway Resurvey", status: "Resurvey" },
//   { id: 4, name: "Construction Site Review", status: "Pending" },
// ];
 
const getStatusColor = (status) => {
  
  switch (status) {
    case "Pending":
      return "text-yellow-400 bg-yellow-800";
    case "Approved":
      return "text-green-400 bg-green-800";
    case "Resurvey":
      return "text-red-400 bg-red-800";
    case "uploaded":
      return "text-blue-400 bg-blue-800";
    case "Submitted":
      return "text-blue-400 bg-blue-800";
    default:
      return "text-gray-400 bg-gray-700";
  }
};


const RecentReports = (userId) => {

  userId = userId.userId.userId;
  console.log("recentReports.userId: ", userId);
  const [videoReports, setVideoReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const fetchVideos = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/videos/${userId}?limit=5`, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // set the limit to 5  by setting the query parameter
      
      });

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setVideoReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-lg text-white font-bold mb-4">Video History</h2>
      <ul className="space-y-4">
        {videoReports.map((video) => (
          <li
            key={video.id}
            className="flex justify-between items-center bg-gray-800 p-4 rounded-md shadow"
          >
            <span className="text-white font-medium">{video.filename}</span>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(video.status)}`}
            >
              {video.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentReports;
