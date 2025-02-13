import React from 'react';
import { FaUserAlt, FaTrashAlt, FaEdit } from 'react-icons/fa'; // Added edit icon
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { Navigation, Pagination } from 'swiper/modules'; // Import necessary Swiper modules

const AdminManagement = () => {
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
        <SwiperSlide>
          <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaUserAlt className="text-white mr-3" />
              <span className="text-lg font-medium text-white">Admin 1</span>
            </div>
            <div className="flex items-center">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mr-2">
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out">
                <FaTrashAlt className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Admin 2 */}
        <SwiperSlide>
          <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaUserAlt className="text-white mr-3" />
              <span className="text-lg font-medium text-white">Admin 2</span>
            </div>
            <div className="flex items-center">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mr-2">
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out">
                <FaTrashAlt className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Admin 3 */}
        <SwiperSlide>
          <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaUserAlt className="text-white mr-3" />
              <span className="text-lg font-medium text-white">Admin 3</span>
            </div>
            <div className="flex items-center">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mr-2">
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out">
                <FaTrashAlt className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Admin 4 */}
        <SwiperSlide>
          <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaUserAlt className="text-white mr-3" />
              <span className="text-lg font-medium text-white">Admin 4</span>
            </div>
            <div className="flex items-center">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mr-2">
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out">
                <FaTrashAlt className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Admin 5 */}
        <SwiperSlide>
          <div className="flex items-center justify-between bg-white bg-opacity-20 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaUserAlt className="text-white mr-3" />
              <span className="text-lg font-medium text-white">Admin 5</span>
            </div>
            <div className="flex items-center">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out mr-2">
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out">
                <FaTrashAlt className="mr-2" />
                Remove
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default AdminManagement;
