import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import DashboardLayout from "./DashboardLayout";
import DashboardNavbar from "../components/DashboardNavbar";

const MapObjects = ({ userId, role }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [limit, setLimit] = useState(5000);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [pageTitle, setPageTitle] = useState("All Videos");
  
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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

  useEffect(() => {
    fetchVideos();
  }, [page, limit, filter]); // Re-fetch videos when page or limit changes

  useEffect(() => {
    if (selectedVideo ) {
      mapboxgl.accessToken = "pk.eyJ1IjoibWluaGFqa2FyaW0wNzgiLCJhIjoiY20zdWZjdGJ6MGo4YzJqcHhqM255eWYyciJ9.JgEUYXKrpFOrHU0WyXuzug";

      // Destroy existing map instance before creating a new one
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Initialize Mapbox map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 0], // Default center (adjusted later)
        zoom: 3,
      });

      // Add markers for detected objects
      if (selectedVideo.detectedObjects.length > 0) {
        // Center the map on the first detected object
        const { x, y } = selectedVideo.detectedObjects[0];
        mapRef.current.setCenter([y, x]);
        mapRef.current.setZoom(12);
        // 
        if (selectedVideo.detectedObjects.length > 0) {
          selectedVideo.detectedObjects.forEach(object => {
            if (!object.x || !object.y) return;
            new mapboxgl.Marker()
              .setLngLat([object.y, object.x])
              .setPopup(new mapboxgl.Popup().setHTML(`
                <div style="text-align: center;">
                  <p>${object.label}</p>
                  <img src="${backendUrl}/${object.image_path}" alt="${object.label}" width="300" height="100" style="border-radius: 8px;"/>
                </div>
              `))
              .addTo(mapRef.current);
              
          });
        }
        
      }
    }
  }, [selectedVideo]); // Runs when selected video changes

  if (loading) return <div>Loading...</div>;

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
          <p>No videos</p> 
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

            {/* Display Map Instead of Video */}
            {selectedVideo && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{selectedVideo.title}</h2>
                <div  key={selectedVideo._id} ref={mapContainerRef} className="w-full h-[400px] rounded-lg shadow-lg" />
                <p className="text-sm text-gray-500 mt-2">
                  Uploaded on: {new Date(selectedVideo.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MapObjects;
