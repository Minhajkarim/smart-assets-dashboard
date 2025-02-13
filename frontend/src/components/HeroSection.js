import React from "react";
import { motion } from "framer-motion";
import { FaCar, FaCloud, FaFileAlt } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#7AC043] text-white min-h-screen flex flex-col justify-center items-center text-center p-8">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AI-Based Road Defects and Object Detection
        </motion.h1>
        <p className="text-xl md:text-2xl mb-6 max-w-2xl">
          Leverage AI for real-time traffic sign and road condition detection with cutting-edge technology.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="bg-blue-500 px-6 py-3 rounded-lg text-lg font-semibold"
        >
          Learn More
        </motion.button>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 bg-white text-black text-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
            <FaCar className="text-4xl mb-4 mx-auto text-[#7AC043]" />
            <h3 className="text-xl font-bold mb-2">Real-Time Detection</h3>
            <p className="mb-4">Utilize cutting-edge AI models for rapid detection of traffic objects with minimal delay, ensuring timely responses.</p>
          </div>
          <div className="shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
            <FaCloud className="text-4xl mb-4 mx-auto text-[#7AC043]" />
            <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
            <p className="mb-4">Effortlessly save and access recordings through our secure cloud platform, providing flexibility and convenience.</p>
          </div>
          <div className="shadow-lg p-6 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
            <FaFileAlt className="text-4xl mb-4 mx-auto text-[#7AC043]" />
            <h3 className="text-xl font-bold mb-2">Reporting System</h3>
            <p className="mb-4">Generate comprehensive reports and insights effortlessly, facilitating informed decision-making for authorities.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
<section id="how-it-works" className="py-12 bg-gray-100 text-black">
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-bold mb-8">How It Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Step 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
      >
        <div className="flex justify-center mb-4">
          <img src="/path/to/detection-icon.png" alt="Detection" className="h-16 w-16" />
        </div>
        <h4 className="text-xl font-bold mb-4">Step 1: Real-Time Detection</h4>
        <p>Our AI-based system leverages advanced image processing techniques to detect road defects and objects in real-time. This ensures prompt identification and action.</p>
      </motion.div>
      
      {/* Step 2 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
      >
        <div className="flex justify-center mb-4">
          <img src="/path/to/cloud-storage-icon.png" alt="Cloud Storage" className="h-16 w-16" />
        </div>
        <h4 className="text-xl font-bold mb-4">Step 2: Cloud Storage</h4>
        <p>All recordings and data are securely stored in the cloud, allowing for easy access, management, and retrieval for analysis whenever needed.</p>
      </motion.div>
      
      {/* Step 3 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
      >
        <div className="flex justify-center mb-4">
          <img src="/path/to/reporting-icon.png" alt="Reporting" className="h-16 w-16" />
        </div>
        <h4 className="text-xl font-bold mb-4">Step 3: Generate Reports</h4>
        <p>Our system generates detailed reports that provide valuable insights for authorities and stakeholders, aiding in the maintenance of road safety and infrastructure integrity.</p>
      </motion.div>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer className="bg-[#7AC043] text-white py-4 text-center">
        <p>&copy; 2024 SmartAssets. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HeroSection;
