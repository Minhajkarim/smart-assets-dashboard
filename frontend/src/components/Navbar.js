import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 p-4 border-b border-black border-opacity-20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <img className="w-20" alt="logo" src={Logo} />
        </div>
        
        {/* Hamburger Menu (Mobile) */}
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className={`lg:flex items-center ${isOpen ? "block" : "hidden"} lg:block`}>
          <a href="#home" className="block lg:inline-block text-white px-4 py-2">Home</a>
          <a href="#services" className="block lg:inline-block text-white px-4 py-2">Services</a>
          <a href="#how-it-works" className="block lg:inline-block text-white px-4 py-2">How It Works</a>
          <a href="#contact" className="block lg:inline-block text-white px-4 py-2">Contact</a>
          <Link to="/signin">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="bg-[#007BFF] px-6 py-3 rounded-lg text-lg font-semibold text-white"
          >
            Get Started
          </motion.button>
        </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
