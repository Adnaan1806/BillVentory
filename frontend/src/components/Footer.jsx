import React from "react";

const Footer = () => {
  return (
    <div className="py-16 px-6 md:px-10 lg:px-20 bg-white">
      {/* Footer Content */}
      <div className="flex flex-col md:flex-row justify-between gap-28">
        {/* Left Section */}
        <div className="flex-1">
          {/* Replaced Logo */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16l-4-4m0 0l4-4m-4 4h16"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">BillVentory</span>
          </div>
          <p className="text-gray-600 leading-7">
            BillVentory connects you with top healthcare professionals for seamless
            appointment bookings. Simplify your healthcare journey today.
          </p>
        </div>

        {/* Center Section */}
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900 mb-5">Company</p>
          <ul className="space-y-3 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer">Home</li>
            <li className="hover:text-blue-500 cursor-pointer">About Us</li>
            <li className="hover:text-blue-500 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-500 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900 mb-5">Get in Touch</p>
          <ul className="space-y-3 text-gray-700">
            <li>Phone: +94 76-272-2093</li>
            <li>Email: adnaanjanees0@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="relative mt-10">
        <div className="absolute -top-10 left-1/4 w-28 h-28 bg-blue-500 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute -bottom-10 right-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-2xl opacity-30"></div>
      </div>

      {/* Divider and Copyright Section */}
      <div className="relative mt-16">
        <hr className="border-gray-300" />
        <p className="py-5 text-sm text-gray-600 text-center">
          © 2024 BillVentory. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
