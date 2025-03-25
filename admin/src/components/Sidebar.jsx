import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-80 bg-white border-r rounded-xl shadow-md p-8 flex flex-col space-y-2">
        {aToken && (
          <ul className="w-full space-y-5">
            <li>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-4 py-2 px-4 w-full rounded-md transition-colors duration-300 ${
                    isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`
                }
                to="/admin-dashboard"
              >
                <img src={assets.home_icon} alt="Dashboard" className="w-5 h-5" />
                <p className="text-sm">Dashboard</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-4 py-2 px-4 w-full rounded-md transition-colors duration-300 ${
                    isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`
                }
                to="/all-appointments"
              >
                <img src={assets.appointment_icon} alt="Appointments" className="w-5 h-5" />
                <p className="text-sm">Appointments</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-4 py-2 px-4 w-full rounded-md transition-colors duration-300 ${
                    isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`
                }
                to="/add-doctor"
              >
                <img src={assets.add_icon} alt="Add Doctor" className="w-5 h-5" />
                <p className="text-sm">Add Doctor</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-4 py-2 px-4 w-full rounded-md transition-colors duration-300 ${
                    isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`
                }
                to="/doctor-list"
              >
                <img src={assets.people_icon} alt="Doctors List" className="w-5 h-5" />
                <p className="text-sm">Doctors List</p>
              </NavLink>
            </li>
          </ul>
        )}

{dToken && (
          <ul className="w-full space-y-5">
            <li>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-4 py-2 px-4 w-full rounded-md transition-colors duration-300 ${
                    isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`
                }
                to="/doctor-dashboard"
              >
                <img src={assets.home_icon} alt="Dashboard" className="w-5 h-5" />
                <p className="text-sm">Dashboard</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-4 py-2 px-4 w-full rounded-md transition-colors duration-300 ${
                    isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`
                }
                to="/doctor-appointments"
              >
                <img src={assets.appointment_icon} alt="Appointments" className="w-5 h-5" />
                <p className="text-sm">Appointments</p>
              </NavLink>
            </li>

            <li>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-4 py-2 px-4 w-full rounded-md transition-colors duration-300 ${
                    isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:bg-gray-100 hover:text-primary"
                  }`
                }
                to="/doctor-profile"
              >
                <img src={assets.people_icon} alt="Doctors List" className="w-5 h-5" />
                <p className="text-sm">Profile</p>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
