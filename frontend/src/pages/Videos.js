import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import DashboardNavbar from "../components/DashboardNavbar";



const Videos = (userId) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  const fetchVideos = async () => {

    try {
      const response = await fetch(`${backendUrl}/api/videos/${userId.userId}?limit=1000`, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      
      });

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setVideos(data);
      console.log("Videos.videos: ", data);
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
    <DashboardLayout role="user">
      <DashboardNavbar />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submitted Videos</h1>
      {videos.length === 0 ? (
        <p>No videos submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{video.title}</h2>
              <video controls className="w-full mt-2">
                <source src={backendUrl +  video.processedPath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-sm text-gray-500">Uploaded on: {video.uploadedAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </DashboardLayout>  
  );
};

export default Videos;
