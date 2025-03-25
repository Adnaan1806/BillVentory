import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden rounded-md">
      {/* Floating Icons */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white bg-opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-60 h-60 bg-white bg-opacity-10 rounded-full blur-3xl"></div>

      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-12 md:py-20">
        {/* Left Section */}
        <div className="md:w-1/2 flex flex-col gap-6 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-yellow-300">Book Your Appointment</span> <br />
            With <span className="underline decoration-slice decoration-yellow-400">Trusted Doctors</span>
          </h1>
          <p className="text-sm md:text-base font-light leading-relaxed">
            Browse our extensive list of trusted doctors and schedule your appointments hassle-free. Your health is our priority.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#speciality"
              className="bg-yellow-400 text-gray-800 px-6 py-3 hover:scale-105 font-medium rounded-lg shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-300"
            >
              Book Appointment
            </a>
            <a
              href="#learn-more"
              className="text-white underline hover:text-yellow-300 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 relative z-10">
          <img
            className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto rounded-lg"
            src={assets.header_img}
            alt="Header Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
