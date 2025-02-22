import React from 'react';
import { FaCog, FaTools, FaUsers } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles
import { useNavigate } from "react-router-dom";

const SystemConfig = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-white mb-6">System Configuration</h2>

      {/* Swiper Slider for Cards */}
      <Swiper
        spaceBetween={10} // Negative space to create overlap effect
        slidesPerView={1.2} // Show a bit more than one slide to create overflow
        centeredSlides={true} // Center the active slide
        pagination={{ clickable: true }} // Enable pagination dots
        loop={false} // Disable infinite loop
        breakpoints={{
          640: { slidesPerView: 1.2 }, // 1.2 slides for small screens (overflow on both sides)
          768: { slidesPerView: 1.2 }, // Same for medium screens
          1024: { slidesPerView: 1.2 }, // Same for large screens
        }}
      >
        {/* Profile Settings Slide */}
      <SwiperSlide>
        <div
          className="bg-white bg-opacity-20 p-8 rounded-lg flex items-center shadow-lg w-full cursor-pointer"
          onClick={() => navigate("/superadmin/profile")} // Redirect to profile settings
        >
          <div className="p-4 bg-white rounded-full text-teal-500 mr-6">
            <FaCog size={30} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
            <p className="text-sm text-white">Update the profile</p>
          </div>
        </div>
      </SwiperSlide>

      {/* Manage Admins Slide */}
      <SwiperSlide>
        <div
          className="bg-white bg-opacity-20 p-8 rounded-lg flex items-center shadow-lg w-full cursor-pointer"
          onClick={() => navigate("/superadmin/team-management")} // Redirect to manage admins
        >
          <div className="p-4 bg-white rounded-full text-green-500 mr-6">
            <FaUsers size={30} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Manage Admins</h3>
            <p className="text-sm text-white">View and manage admins.</p>
          </div>
        </div>
      </SwiperSlide>

        {/* Set Limits Slide */}
        {/* <SwiperSlide>
          <div className="bg-white bg-opacity-20 p-8 rounded-lg flex items-center shadow-lg w-full">
            <div className="p-4 bg-white rounded-full text-teal-600 mr-6">
              <FaTools size={30} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Set Limits</h3>
              <p className="text-sm text-white">Define operational limits for the system.</p>
            </div>
          </div>
        </SwiperSlide> */}
      </Swiper>
    </div>
  );
};

export default SystemConfig;
