import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
      {/* Left Side */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 text-center md:text-left">
        <div className="text-4xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide">
          <p>Book <span className="text-yellow-300">Appointment</span></p>
          <p className="mt-4 text-lg sm:text-xl">With 100+ Trusted <span className="text-yellow-300">Doctors</span></p>
        </div>
        <button
          onClick={() => { navigate('/login'); scrollTo(0, 0) }}
          className="bg-yellow-400 text-gray-800 px-6 py-3 hover:scale-105 mt-5 font-medium rounded-lg shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-300"
        >
          Create Account
        </button>
      </div>

      {/* Right Side */}
      <div className="flex-shrink-0 w-full md:w-1/2 lg:w-[370px] mt-8 md:mt-0 p-4 flex justify-center">
        <img
          className="max-w-full h-auto rounded-lg"
          src={assets.appointment_img}
          alt="Appointment"
        />
      </div>
    </div>
  )
}

export default Banner;
