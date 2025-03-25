import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-300">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-center gap-2"
      >
        <h1 className="text-3xl font-extrabold tracking-wide">
          <span className="text-black">BillVentory</span>
          <span className="text-primary">.</span>
        </h1>
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-8 font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-primary border-b-2 border-customOrange"
              : "text-gray-600 hover:text-primary"
          }
        >
          INVENTORY
        </NavLink>
        <NavLink
          to="/billing"
          className={({ isActive }) =>
            isActive
              ? "text-primary border-b-2 border-customOrange"
              : "text-gray-600 hover:text-primary"
          }
        >
          BILLING
        </NavLink>
        <NavLink
          to="/sales"
          className={({ isActive }) =>
            isActive
              ? "text-primary border-b-2 border-customOrange"
              : "text-gray-600 hover:text-primary"
          }
        >
          SALES
        </NavLink>
      </ul>

      <div className="flex items-center gap-4 relative">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 h-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />

            <div className="absolute top-0 pt-14 right-0 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 rounded-lg p-4 bg-white shadow-lg group-hover:flex flex-col gap-4 hover:text-blue-400">
                <p
                  onClick={() => navigate("my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
              
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-lg font-light hidden md:block"
          >
            Create account
          </button>
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* Mobile Menu */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">INVENTORY</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/billing">
              <p className="px-4 py-2 rounded inline-block">BILLING</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/sales">
              <p className="px-4 py-2 rounded inline-block">SALES</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
