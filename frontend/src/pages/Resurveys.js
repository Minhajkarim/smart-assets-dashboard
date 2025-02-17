import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardLayout from "./DashboardLayout";

const Resurveys = (userId) => {
  const [resurveys, setResurveys] = useState([]);
  // userId = userId.userId.userId;
    console.log("recentReports.userId: ", userId);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    const fetchResurveys = async () => {
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
        setResurveys(data);
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
        
    
  return (
    <DashboardLayout role="user">
      <DashboardNavbar />
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-4">Resurveys</h1>
        {resurveys.length === 0 ? (
          <p>No resurveys available.</p>
        ) : (
          <ul className="space-y-4">
            {resurveys.map((resurvey) => (
              <li key={resurvey._id} className="border p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold">{resurvey.filename}</h2>
                <p>{resurvey.resurveryComments[0]}</p>
                <p className="text-sm text-gray-500">Date: {resurvey.lastModifiedAt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Resurveys;
