import React, { useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const VideoWithMap = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const videoCoordinates = { lat: 25.788171416737896, lng: 55.988832614656125 };

  const handleFileUpload = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const processVideo = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      const response = await axios.post("http://localhost:8000/process_video/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDetectedObjects(response.data.objects);
    } catch (error) {
      console.error("Error processing video:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Video Player Section */}
      <div className="w-full lg:w-2/3">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {videoFile && (
          <>
            <ReactPlayer
              url={URL.createObjectURL(videoFile)}
              controls
              width="100%"
              height="400px"
            />
            <button
              onClick={processVideo}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Process Video
            </button>
          </>
        )}
      </div>

      {/* Map Section */}
      <div className="w-full lg:w-1/3 h-96">
        <Map
          initialViewState={{
            longitude: videoCoordinates.lng,
            latitude: videoCoordinates.lat,
            zoom: 14,
          }}
          mapboxAccessToken="eyJ1IjoibWluaGFqa2FyaW0wNzgiLCJhIjoiY20zdWZsaWc0MGd1OTJrcGN5NWtlMjN5MyJ9"
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {/* Video Location Marker */}
          <Marker
            longitude={videoCoordinates.lng}
            latitude={videoCoordinates.lat}
            color="red"
          >
            <div className="bg-red-500 text-white p-1 rounded">Video Location</div>
          </Marker>

          {/* Detected Objects Markers */}
          {detectedObjects.map((obj, index) => (
            <Marker key={index} longitude={obj.lng} latitude={obj.lat} color="blue">
              <div className="bg-blue-500 text-white p-1 rounded text-xs">
                {obj.name}
              </div>
            </Marker>
          ))}
        </Map>
      </div>
    </div>
  );
};

export default VideoWithMap;
