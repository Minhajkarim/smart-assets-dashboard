import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import DashboardNavbar from "../components/DashboardNavbar";
import axios from "axios";

const WatchVideo = ({ userId, role }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [limit, setLimit] = useState(5000);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [pageTitle, setPageTitle] = useState("All Videos");

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const fetchVideos = async () => {
    let response;
    try {
      if (filter === "all") {
      response = await fetch(
        `${backendUrl}/api/videos?limit=${limit}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } else if (filter === "uploaded") {
      response = await fetch(
        `${backendUrl}/api/videos?limit=${limit}&page=${page}&status=uploaded`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
      if (!response){
        throw new Error("Failed to fetch videos");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setVideos(data.videos);
      if (filter === "uploaded") setPageTitle("Uploaded Videos");
      else if (filter === "all") setPageTitle("All Videos");

      if (data.videos.length > 0) {
        setSelectedVideo(data.videos[0]); // Select first video by default
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (videoId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/videos/report/${videoId}`,
        {
          responseType: "blob", // Important to handle file downloads
        }
      );

      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${videoId}.xlsx`); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Error downloading report. Please try again later.");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, limit, filter]); // Re-fetch videos when page or limit changes

 
  if  (loading) return <div>Loading...</div>;
  return (
    <DashboardLayout role={role}>
      <DashboardNavbar />

        
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{pageTitle}</h1>
        {/* Filter Dropdown */}
        <div className="mb-4">
          <label htmlFor="filterSelect" className="block font-semibold mb-2">
            Filter by status:
          </label>
          <select
            id="filterSelect"
            className="border rounded-md p-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="uploaded">Uploaded Only</option>
          </select>
        </div>

        {videos.length === 0 ? (
          <p>No videos pending</p>
        ) : (
          <div>
            {/* Video Selector Dropdown */}
            <label htmlFor="videoSelect" className="block text-lg font-semibold mb-2">
              Select a Video:
            </label>
            <select
              id="videoSelect"
              className="border rounded-md p-2 w-full mb-4"
              onChange={(e) => {
                const selected = videos.find((v) => v._id === e.target.value);
                setSelectedVideo(selected);
              }}
              value={selectedVideo?._id || ""}
            >
              {videos.map((video) => (
                <option key={video._id} value={video._id}>
                  {video.filename}
                </option>
              ))}
            </select>

            {/* Main Video Player */}
            {selectedVideo && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{selectedVideo.title}</h2>
                <video key={selectedVideo?._id} controls className="w-full h-96 rounded-lg shadow-lg">
                  <source src={`${backendUrl}${selectedVideo.processedPath}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded on: {new Date(selectedVideo.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            )}           
          </div>
        )}
        <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    onClick={() => downloadReport(selectedVideo._id)}
                  >
                    Download Report
        </button>

      </div>
    </DashboardLayout>
  );
};

export default WatchVideo;
