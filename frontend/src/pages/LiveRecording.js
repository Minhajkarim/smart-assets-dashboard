import React, { useEffect, useRef } from "react";

const LiveRecording = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Access the user's webcam
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing the camera: ", error);
      }
    };

    startCamera();

    // Clean up: Stop the camera when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-lg shadow-lg"
        width="600"
        height="400"
      />
    </div>
  );
};

export default LiveRecording;
