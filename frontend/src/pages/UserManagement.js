import React from 'react';
import { FaUserAlt, FaTrashAlt, FaEdit } from 'react-icons/fa'; // Adding edit icon

const UserManagement = () => {
  // Function to assign colors based on roles
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'traffic light':
        return 'bg-green-500'; // Green for traffic light
      case 'sign boards':
        return 'bg-yellow-500'; // Yellow for sign boards
      case 'road cracks':
        return 'bg-red-500'; // Red for road cracks
      default:
        return 'bg-gray-400'; // Default color
    }
  };

  // Users data
  const users = [
    { id: 1, name: 'User 1', role: 'traffic light' },
    { id: 2, name: 'User 2', role: 'sign boards' },
    { id: 3, name: 'User 3', role: 'road cracks' },
  ];

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
      
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* User info and role */}
            <div className="flex items-center space-x-4">
              <FaUserAlt className="text-purple-600" />
              <div>
                <span className="text-lg font-medium text-gray-800">{user.name}</span>
                <div className="flex items-center mt-1">
                  <span className={`w-3 h-3 rounded-full ${getRoleBadgeColor(user.role)} mr-2`}></span>
                  <span className="text-sm text-gray-600 capitalize">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out">
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out">
                <FaTrashAlt className="mr-2" />
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
