import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto rounded-lg p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-6">
            <label htmlFor="image" className="relative cursor-pointer">
              <div className="relative">
                <img
                  className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="User"
                />
                {isEdit && (
                  <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <img src={assets.upload_icon} alt="Upload" />
                  </div>
                )}
              </div>
              {isEdit && (
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              )}
            </label>

            {isEdit ? (
              <input
                className="text-3xl font-semibold text-center bg-gray-50 p-2 rounded-lg border focus:outline-none"
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <p className="text-3xl font-bold text-gray-800">
                {userData.name}
              </p>
            )}
          </div>

          <hr className="my-6" />

          {/* Profile Details */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-[1fr_3fr] gap-4">
                <p>Email:</p>
                <p className="text-blue-500">{userData.email}</p>

                <p>Phone:</p>
                {isEdit ? (
                  <input
                    className="bg-white p-2 rounded-lg border focus:outline-none"
                    type="text"
                    value={userData.phone}
                    minLength={11}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                ) : (
                  <p>{userData.phone}</p>
                )}

                <p>Address:</p>
                {isEdit ? (
                  <div className="space-y-2">
                    <input
                      className="bg-white p-2 rounded-lg border focus:outline-none w-full"
                      type="text"
                      value={userData.address.line1}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value },
                        }))
                      }
                    />
                    <input
                      className="bg-white p-2 rounded-lg border focus:outline-none w-full"
                      type="text"
                      value={userData.address.line2}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value },
                        }))
                      }
                    />
                  </div>
                ) : (
                  <p>
                    {userData.address.line1} <br /> {userData.address.line2}
                  </p>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-[1fr_3fr] gap-4">
                <p>Gender:</p>
                {isEdit ? (
                  <select
                    className="bg-white p-2 rounded-lg border focus:outline-none"
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p>{userData.gender}</p>
                )}

                <p>Birthday:</p>
                {isEdit ? (
                  <input
                    className="bg-white p-2 rounded-lg border focus:outline-none"
                    type="date"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                  />
                ) : (
                  <p>{userData.dob}</p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-center">
            {isEdit ? (
              <button
                className="bg-blue-500 text-white px-8 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                onClick={updateUserProfile}
              >
                Save Information
              </button>
            ) : (
              <button
                className="bg-yellow-400 text-gray-800 px-6 py-3 hover:scale-105 font-medium rounded-lg shadow-lg hover:bg-yellow-300 hover:shadow-xl transition-all duration-300"
                onClick={() => setIsEdit(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
