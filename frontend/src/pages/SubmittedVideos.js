// SubmittedVideos.js
import React from "react";

const SubmittedVideos = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Submitted Videos</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Your Submitted Videos</h2>
        {/* Display submitted videos here */}
      </div>
    </div>
  );
};

export default SubmittedVideos;
