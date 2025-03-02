import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaEye, FaEllipsisH, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";



const VideoApprovals = () => {
   const [videos, setVideos] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const [limit, setLimit] = useState(5);
      const [page, setPage] = useState(1);
      const [pages, setPages] = useState(1);
      const [currentVideo, setCurrentVideo] = useState({});

      const fetchVideos = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/videos?limit=${limit}&page=${page}&status=uploaded`,
            {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch videos");
          }
          const data = await response.json();
          setVideos(data.videos);
          setCurrentVideo(data.videos[0]);
          setPages(data.totalPages);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    
      };
      const handleNext = () => {
        if (page <= pages){
          setPage((prevPage) => prevPage + 1);
        }
      }

      const handlePrevious = () => {
        if (page > 1){
          setPage((prevPage) => prevPage - 1);
        }
      };

      const handleWatch = (url) => {
        window.open(url, "_blank");
      };

      const handleApprove = async (video) => {
        const id = video._id;
        try {
          const response = await fetch(`${backendUrl}/api/videos/update/${id}`, {
            method: "PUT", 
            headers: {
              "Content-Type": "application/json", 
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: "Approved" }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch videos");
          }

          setVideos((prevVideos) => prevVideos.filter((vid) => vid._id !== id));
          fetchVideos();

        } catch (err) {
          setError(err.message);
        } 
      };


      const handleReject = async (video) => {
        const id = video._id;
        try {
          const response = await fetch(`${backendUrl}/api/videos/update/${id}`, {
            method: "PUT", 
            headers: {
              "Content-Type": "application/json", 
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: "Resurvey" }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch videos");
          }

          setVideos((prevVideos) => prevVideos.filter((vid) => vid._id !== id));
          fetchVideos();

        } catch (err) {
          setError(err.message);
        } 
      };


      useEffect(() => {
        fetchVideos();
      }, [page]);
      if (loading) return <div className="text-white text-lg">Loading...</div>;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <ul className="space-y-4">
      {
      
      videos.length === 0 ? (
          <p
            className="text-white text-lg" 
          >No new videos available</p>
        ) : (
      videos.map((video) => (
        <li key={video._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Video Thumbnail and Name */}
          <div className="flex items-center">
            <span className="text-xs font-medium">{video.filename}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 items-center">
            {/* Watch Button */}
            <button onClick={
                () => handleWatch(`${backendUrl}${video.processedPath}`)
              }
            className="bg-blue-500 text-white px-2 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-200">
              <FaEye className="mr-2" 
              /> Watch
            </button>

            {/* Approve Button */}
            <button 
            className="bg-green-500 text-white px-2 py-2 rounded-lg flex items-center hover:bg-green-600 transition duration-200"
            onClick={
              async () => await handleApprove(video)
            }>
              <FaCheck className="mr-2" /> Approve
            </button>

            {/* Reject Button */}
            <button 
            className="bg-red-500 text-white px-2 py-2 rounded-lg flex items-center hover:bg-red-600 transition duration-200"
            onClick={
              () => handleReject(video)
            }>
              <FaTimes className="mr-2" 
              
              /> Reject
            </button>

            {/* More Options - 3 Dots
            <button className="text-gray-500 hover:text-gray-700 transition duration-200">
              <FaEllipsisH size={20} />
            </button> */}
          </div>
        </li>
      )))}
     
      
     </ul>
      
     {videos.length !== 0 ? (
          <ul className="flex space-x-4 mt-4">
            <button 
            className="bg-yellow-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-red-600 transition duration-200"
            onClick={handlePrevious}
            disabled={page === 1}

            >
                  <FaRegArrowAltCircleLeft className="mr-2"/> Previous
                  
            </button>

            {/* current page */}

            <span className="text-white text-lg">{page}/{pages}</span>
            <button 
            className="bg-yellow-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-red-600 transition duration-200"
            onClick={handleNext}
            disabled={page === pages}


            >
                  <FaRegArrowAltCircleRight className="mr-2"/> Next
                  
            </button>
          </ul>
        ) : ("")};
</div>
  );
};
export default VideoApprovals;
