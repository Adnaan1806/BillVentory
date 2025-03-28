import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const { data } = await axios.post(backendUrl + "/api/user/login", {
        password,
        email,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Logged in successfully!");
        navigate("/home");
      } else {
        setErrorMessage(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage("User does not exist. Please contact your administrator.");
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Handle back navigation
    const handlePopState = () => {
      if (!localStorage.getItem("verified")) {
        // Remove token if verification not completed
        localStorage.removeItem("token");
        setToken(null);
        toast.warning("Session expired. Please log in again.");
        navigate("/login");
      }
    };

    // Add event listener for back navigation
    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, setToken]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-lg text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl w-full flex justify-center font-semibold">
          Login to BillVentory
        </p>
        <p className="w-full flex justify-center">
          Please log in to manage your inventory and bills
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="w-full relative">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type={isPasswordVisible ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            placeholder="Enter your password"
          />
          <span
            className="absolute right-3 top-10 cursor-pointer text-gray-500"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {!isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button
          type="submit"
          className="bg-customOrange text-white w-full py-2 rounded-md text-base mt-2 hover:bg-lightRed"
        >
          Login
        </button>

        {errorMessage && (
          <p className="w-full text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        <p className="w-full text-center text-sm text-gray-500 mt-2">
          Contact your administrator to create an account
        </p>
      </div>
    </form>
  );
};

export default Login;
