import React, { useState, useEffect } from "react";

const Videos = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Simulated API call to fetch submitted videos
    const fetchVideos = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("/api/videos"); // Example API
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Submitted Videos</h1>
      {videos.length === 0 ? (
        <p>No videos submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{video.title}</h2>
              <video controls className="w-full mt-2">
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-sm text-gray-500">Uploaded on: {video.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
