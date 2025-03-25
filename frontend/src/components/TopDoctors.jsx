import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col md:flex-row items-start gap-10 my-16 px-6 md:px-16">
      {/* Left Section: Heading and Description */}
      <div className="md:w-1/3 flex flex-col gap-4 mt-56 text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-900">
          Book Appointments with<span className="text-yellow-300"> Top Specialists</span>
        </h1>
        <p className="text-sm md:text-base font-regular text-gray-700">
          Browse through our extensive list of trusted doctors and find the best for your needs.
        </p>
      </div>

      {/* Right Section: Doctor Cards */}
      <div className="md:w-2/3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {doctors.slice(0, 6).map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm ${
                    item.available ? "text-green" : "text-gray-500"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-green" : "bg-gray-500"
                    }`}
                  ></span>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-lg font-medium text-gray-900 mt-2">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>

        {/* More Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              navigate("/doctors");
              scrollTo(0, 0);
            }}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            More
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopDoctors;
