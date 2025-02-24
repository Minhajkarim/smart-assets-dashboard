import React, { useEffect, useState } from "react";

const OutputVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos from the backend
    fetch("/api/videos") // Replace with your actual API endpoint
      .then((res) => res.json())
      .then((data) => {
        setVideos(data); // Set video data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Output Videos</h2>

      {loading ? (
        <p>Loading videos...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div key={index} className="flex flex-col items-center">
              <video
                src={video.url}
                controls
                className="w-64 h-40 rounded-lg shadow-md"
              />
              <p className="mt-2 text-sm">{video.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutputVideos;
