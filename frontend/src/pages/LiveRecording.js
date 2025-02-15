import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { BsCamera, BsStopCircle } from "react-icons/bs";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
import { v4 as uuidv4 } from "uuid";
// import L from "leaflet";
// Import default icon images
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// // Fix the default Icon path
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });
const LiveRecording = () => {
  const [clientId, setClientId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [videoId, setVideoId] = useState(null);
  const frameIdRef = useRef(0);
  const [loading, setLoading] = useState(true); // Loading state for fetching videos

  const [videosList, setVideosList] = useState([]); // List of recorded videos

  const [processingProgress, setProcessingProgress] = useState(0);
  const [frameCount, setFrameCount] = useState("0/0");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const locationWatchId = useRef(null);
  const socket = useRef(null);
  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Fetch the list of recorded videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/recorded-videos`);
        setVideosList(response.data); // Ensure videos is always an array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };

    // fetchVideos();
  }, [backendUrl]);

  useEffect(() => {
    // Initialize Socket.IO
    socket.current = io(
      process.env.REACT_APP_SOCKET_URL || "http://localhost:5000"
    );
    socket.current.on("connect", () =>
      console.log("Connected to Socket.IO server")
    );

    socket.current.on("videoSaved", (data) => {
      console.log("Video saved successfully");
      console.log("Video ID:", data.videoId);
      alert("Video saved successfully");
    });

    socket.current.on("clientId", (data) => {
      setClientId(data.clientId);
      if (!data.clientId) {
        console.error("Error fetching clientId from server.");
        alert("Error fetching clientId from server.");
      }
      setClientId(data.clientId);
    });

    socket.current.on("processingProgress", (data) => {
      console.log("Processing progress:", data);
      setProcessingProgress(data.progress);
      setFrameCount(`${data.message}`);
    });

    // Cleanup
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    startLocationTracking();

    return () => {
      stopLocationTracking();
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Keeping dependency array empty.

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 500,
      maximumAge: 0,
    };

    locationWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocations((prev) => {
          const updated = [
            ...prev,
            { latitude, longitude, timestamp: Date.now() },
          ];
          return updated.slice(-100); // Keep the last 100 locations
        });
        socket.current.emit("locationData", {
          latitude,
          longitude,
          timestamp: Date.now(),
          clientId: clientId,
          videoId: videoId,
        });
      },
      (error) => {
        console.error("Error accessing location:", error);
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access is required for this feature.");
        }
      },
      options
    );
  };

  const stopLocationTracking = () => {
    if (locationWatchId.current !== null) {
      navigator.geolocation.clearWatch(locationWatchId.current);
    }
  };

  const startRecording = async () => {
    const newVideoId = uuidv4();
    setVideoId(newVideoId);

    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1920, max: 1280 },
          height: { ideal: 1080, max: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      setMediaRecorder(recorder);

      //   recorder.ondataavailable = (event) => {
      //     if (event.data.size > 0) {
      //       setRecordedChunks((prev) => [...prev, event.data]);
      //       socket.current.emit("frameData", event.data);
      //     }
      //   };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const frameTimestamp = Date.now(); // Capture the current timestamp
          setRecordedChunks((prev) => [
            ...prev,
            { data: event.data, timestamp: frameTimestamp },
          ]);

          // Increment frame ID
          frameIdRef.current += 1;

          // Emit frame data with timestamp via socket
          socket.current.emit("frameData", {
            data: event.data,
            timestamp: frameTimestamp,
            clientId: clientId,
            videoId: newVideoId,
            frameId: frameIdRef.current,
          });
        }
      };

      recorder.start(100);
      setIsRecording(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(
        "Unable to start recording. Please ensure camera access is allowed."
      );
    }
  };

  const togglePause = () => {
    if (mediaRecorder) {
      if (isPaused) {
        mediaRecorder.resume();
      } else {
        mediaRecorder.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }

    socket.current.emit("stopRecording", {
      clientId: clientId,
      videoId: videoId,
    });
    setIsRecording(false);
    setIsPaused(false);
    frameIdRef.current = 0;

    uploadRecording();
  };

  const uploadRecording = async () => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const videoFile = new File([blob], `recorded-${Date.now()}.webm`, {
        type: "video/webm",
      });

      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("locations", JSON.stringify(locations));

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/reports`,
          formData
        );
        alert("Report generated successfully!");
        console.log("Report response:", response.data);
      } catch (error) {
        console.error("Error generating report:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl">
        <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden mb-6">
          <video
            ref={videoRef}
            className="absolute w-full h-full object-cover"
            autoPlay
            muted
          />
          <canvas ref={canvasRef} className="absolute w-full h-full" />
        </div>

        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
          >
            <BsCamera /> Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={togglePause}
              className="bg-yellow-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition duration-200"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200"
              // bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200
            >
              <BsStopCircle /> Stop
            </button>
          </>
        )}
        {processingProgress > 0 && (
          <div className="mt-4 relative w-full overflow-hidden mb-6">
            <h3 className="text-sm font-semibold mb-2">Processing Progress</h3>
            <div className="relative w-full h-6 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-green-600 rounded-lg transition-all duration-300 ease-in-out"
                style={{ width: `${processingProgress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {processingProgress}% - {frameCount}
              </span>
            </div>
          </div>
        )}

        {/* <MapContainer
          center={
            locations.length > 0
              ? [
                  locations[locations.length - 1].latitude,
                  locations[locations.length - 1].longitude,
                ]
              : [0, 0]
          }
          zoom={4}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {!loading &&
            videosList.map((video, videoIndex) => {
              // Fallback to an empty array if detectedObjects is missing
              const objects = video.detectedObjects || [];

              return objects.map((obj, objIndex) => {
                return (
                  <Marker
                    key={`${videoIndex}-${objIndex}`}
                    position={[obj.x, obj.y]}
                  >
                    <Popup>
                      <p>Detected: {obj.label}</p>
                    </Popup>
                  </Marker>
                );
              });
            })}
        </MapContainer> */}
      </div>
    </div>
  );
};

export default LiveRecording;
