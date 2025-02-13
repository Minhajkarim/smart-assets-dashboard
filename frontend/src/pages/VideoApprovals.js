import React from "react";
import { FaCheck, FaTimes, FaEye, FaEllipsisH } from "react-icons/fa"; // Importing icons

const VideoApprovals = () => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <ul className="space-y-4">
        <li className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Video Thumbnail and Name */}
          <div className="flex items-center">
            <img 
              src="data:image/jpeg;base64,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" 
              alt="Video Thumbnail" 
              className="w-16 h-16 rounded-lg mr-4 object-cover"
            />
            <span className="text-lg font-medium">Video 1</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 items-center">
            {/* Watch Button */}
            <button className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-200">
              <FaEye className="mr-2" /> Watch
            </button>

            {/* Approve Button */}
            <button className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-green-600 transition duration-200">
              <FaCheck className="mr-2" /> Approve
            </button>

            {/* Reject Button */}
            <button className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-red-600 transition duration-200">
              <FaTimes className="mr-2" /> Reject
            </button>

            {/* More Options - 3 Dots */}
            <button className="text-gray-500 hover:text-gray-700 transition duration-200">
              <FaEllipsisH size={20} />
            </button>
          </div>
        </li>

        <li className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Video Thumbnail and Name */}
          <div className="flex items-center">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWIka6mx-2tspOmvqASHwV7KUvciw9Wiaoqg&s" 
              alt="Video Thumbnail" 
              className="w-16 h-16 rounded-lg mr-4 object-cover"
            />
            <span className="text-lg font-medium">Video 2</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 items-center">
            {/* Watch Button */}
            <button className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-blue-600 transition duration-200">
              <FaEye className="mr-2" /> Watch
            </button>

            {/* Approve Button */}
            <button className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-green-600 transition duration-200">
              <FaCheck className="mr-2" /> Approve
            </button>

            {/* Reject Button */}
            <button className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-red-600 transition duration-200">
              <FaTimes className="mr-2" /> Reject
            </button>

            {/* More Options - 3 Dots */}
            <button className="text-gray-500 hover:text-gray-700 transition duration-200">
              <FaEllipsisH size={20} />
            </button>
          </div>
        </li>

        {/* Add more videos as needed */}
      </ul>
    </div>
  );
};

export default VideoApprovals;
