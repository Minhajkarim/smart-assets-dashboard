import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaTrashAlt, FaEdit, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from 'react-icons/fa'; // Adding edit icon

const UserManagement = () => {
  const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [limit, setLimit] = useState(5);
      const [page, setPage] = useState(1);
      const [pages, setPages] = useState(1);
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/users?limit=${limit}&page=${page}`, 
            {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
    
          if (!response.ok) {
            throw new Error("Failed to fetch videos");
          }
    
          const data = await response.json();
          setUsers(data.users);
          setPages(data.totalPages);


        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    
      };
    
      useEffect(() => {
        fetchUsers();
      }, [page]);
    
      if (loading) return <div className="text-white text-lg">Loading...</div>;

  
        const test = [
          {
            "_id": "60e7e2c2b9a2b00015a4e6a8",
            "filename": "video.mp4",
            "uploadPath": "uploads/60e",
            "processedPath": "processed/60e",
            "status": "Resurvey",
            "uploadedAt": "2021-07-09T14:00:00.000Z",
            "lastModifiedAt": "2021-07-09T14:00:00.000Z",
            "processedAt": null,
            "detectedObjects": [],
            "statusHistory": [],
            "processingError": null,
            "resurveryComments": ["Resurvey"],
  
          }
        ]
          

  
  // Function to assign colors based on roles
  const getRoleBadgeColor = (role) => {
    switch (role) {
      // case 'traffic light':
      //   return 'bg-green-500'; // Green for traffic light
      // case 'sign boards':
      //   return 'bg-yellow-500'; // Yellow for sign boards
      // case 'road cracks':
      //   return 'bg-red-500'; // Red for road cracks
      // default:
      //   return 'bg-gray-400'; // Default color
      case 'user':
        return 'bg-green-500'; // Green for traffic light
      case 'admin':
        return 'bg-yellow-500'; // Yellow for sign boards
      case 'superadmin':
        return 'bg-red-500'; // Red for road cracks
      default:
        return 'bg-gray-400'; // Default color
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

  const handleDelete = async (user) => {
    console.log("DELETE CALLED:", user);
    try {
      const response = await fetch(`${backendUrl}/api/users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove the user from the list
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  

  // Users data
  const users1 = [
    { id: 1, name: 'User 1', role: 'traffic light' },
    { id: 2, name: 'User 2', role: 'sign boards' },
    { id: 3, name: 'User 3', role: 'road cracks' },
  ];

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
      
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user._id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* User info and role */}
            <div className="flex items-center space-x-4">
              <FaUserAlt className="text-purple-600" />
              <div>
                <span className="text-lg font-medium text-gray-800">{user.name}</span>
                <p className="text-xs font-medium text-gray-800">{user.email}</p>
                <div className="flex items-center mt-1">
                  <span className={`w-3 h-3 rounded-full ${getRoleBadgeColor(user.role)} mr-2`}></span>
                  <span className="text-sm text-gray-600 capitalize">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              {/* <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
              onClick={() =>handleEdit(user)}
              >
                <FaEdit className="mr-2" />
                Edit
              </button> */}
              <button 
              className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
              onClick={async ()=>{await handleDelete(user)}}>
                <FaTrashAlt className="mr-2" />
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      {users.length !== 0 ? (
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

export default UserManagement;
