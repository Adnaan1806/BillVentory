import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="min-h-screen p-8 md:p-20">
      {/* Header */}
      <div className="text-center text-4xl font-extrabold text-gray-800">
        <p>
          Contact <span className="text-yellow-300">US</span>
        </p>
      </div>

      {/* Contact Section */}
      <div className="my-16 flex flex-col md:flex-row items-center gap-12">
        {/* Contact Image */}
        <img
          className="w-full md:max-w-[400px] rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
          src={assets.contact_image}
          alt="Contact Us"
        />

        {/* Contact Information */}
        <div className="flex flex-col justify-center gap-8 md:w-3/5 text-gray-700">
          {/* Office Info */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:scale-y-110 transition-all duration-500">
            <h3 className="font-bold text-xl text-gray-800">Our Office</h3>
            <p className="mt-4 text-gray-600">
              54709 Willms Station <br />
              Suite 350, Washington, USA
            </p>
          </div>

          {/* Get in Touch */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:scale-y-110 transition-all duration-500">
            <h3 className="font-bold text-xl text-gray-800">Get in Touch</h3>
            <p className="mt-4 text-gray-600">
              Tel: (+94) 76-272-2093 <br />
              Email: adnaanjanees0@gmail.com
            </p>
          </div>

          {/* Careers */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:scale-y-110 transition-all duration-500">
            <h3 className="font-bold text-xl text-gray-800">
              Careers at <span className="text-blue-500">PRESCRIPTO</span>
            </h3>
            <p className="mt-4 text-gray-600">
              Learn more about our teams and job openings.
            </p>
          </div>

          {/* Explore Jobs Button */}
          <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 hover:scale-105 mt-6 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
