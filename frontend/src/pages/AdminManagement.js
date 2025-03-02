import React, {useState, useEffect} from 'react';
import { FaUserAlt, FaTrashAlt, FaEdit } from 'react-icons/fa'; // Added edit icon
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Navigation, Pagination } from 'swiper/modules'; // Import necessary Swiper modules
import 'swiper/css'; 
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AdminManagement = () => {
  const [admins, setAdmins] = React.useState([]); // Initialize admins state
  const [loading, setLoading] = React.useState(true); // Initialize loading state
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Get backend URL from environment variable

  // Fetch all admins from the backend

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/users/admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    try {
      const response = await fetch(`${backendUrl}/api/users/${admin._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete admin");
      }
      fetchAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }
  , []); // Fetch admins only once

  if (loading)  return <div className="text-grey text-lg">Loading...</div>;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Admin Management</h2>

      {/* Vertical Swiper Slider */}
      <Swiper
        direction={'vertical'} // Enables vertical scrolling
        slidesPerView={3} // Show three admins per slide
        spaceBetween={5} // Add spacing between slides
        pagination={{ clickable: true }} // Enable pagination dots
        loop={false} // Disable infinite loop
        modules={[Navigation, Pagination]} // Use modules array
        className="h-60" // Set height for the swiper container
      >
        {/* Admin 1 */}
        {admins.length=== 0  ? <div>"No Admins"</div>: admins.map((admin) => (
           <SwiperSlide key={admin._id}>
           <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
             <div className="flex items-center">
               <FaUserAlt className="text-white mr-3" />
               <span className="text-lg font-medium text-white">{admin.name}</span>
             </div>
             <div className="flex items-center">
               {/* <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mr-2">
                 <FaEdit className="mr-2" />
                 Edit
               </button> */}
               <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
                 onClick={() => handleDeleteAdmin(admin)}>
                 <FaTrashAlt className="mr-2" />
                 Remove
               </button>
           
             </div>
           </div>
         </SwiperSlide>  
        ))}
      </Swiper>
    </div>
  );
};

export default AdminManagement;
