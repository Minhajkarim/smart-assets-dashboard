import React from "react";

const videoReports = [
  { id: 1, name: "Survey Area A", status: "Pending" },
  { id: 2, name: "Bridge Inspection", status: "Approved" },
  { id: 3, name: "Highway Resurvey", status: "Resurvey" },
  { id: 4, name: "Construction Site Review", status: "Pending" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "text-yellow-400 bg-yellow-800";
    case "Approved":
      return "text-green-400 bg-green-800";
    case "Resurvey":
      return "text-red-400 bg-red-800";
    default:
      return "text-gray-400 bg-gray-700";
  }
};

const RecentReports = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-lg text-white font-bold mb-4">Video History</h2>
      <ul className="space-y-4">
        {videoReports.map((video) => (
          <li
            key={video.id}
            className="flex justify-between items-center bg-gray-800 p-4 rounded-md shadow"
          >
            <span className="text-white font-medium">{video.name}</span>
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
