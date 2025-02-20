import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardLayout from "./DashboardLayout";

const Resurveys = (userId) => {
  const [resurveys, setResurveys] = useState([]);
  userId = userId.userId;
    console.log("recentReports.userId: ", userId);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    const fetchResurveys = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/videos/${userId}?limit=5&status=Resurvey`, 
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
        setResurveys(data);
        console.log("Resurveys: ", resurveys);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
  
    };
  
    useEffect(() => {
      fetchResurveys();
    // setResurveys(test);

    }, []);
  
    if (loading) return <div>Loading...</div>;

      const test = [
        {
          "_id": "60e7e2c2b9a2b00015a4e6a8",
          "filename": "video.mp4",
          "uploadPath": "uploads/60e",
          "processedPath": "processed/60e",
          "status": "Resurvey",
          "uploadedAt": "2021-07-09T14:00:00.000Z",
          "lastModifiedAt": "2021-07-09T14:00:00.000Z",
          "processedAt": null,
          "detectedObjects": [],
          "statusHistory": [],
          "processingError": null,
          "resurveryComments": ["Resurvey"],

        }
      ]

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
        
    
  return (
    <DashboardLayout role="user">
      <DashboardNavbar />
      <div className="py-6">
      <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-lg text-white font-bold mb-4">Resurveys</h2>
      <ul className="space-y-4">
        {resurveys.map((video) => (
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
    </div>
    </DashboardLayout>
  );
};

export default Resurveys;
