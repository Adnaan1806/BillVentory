import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfweek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [medicalReason, setMedicalReason] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(23, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book appointment");
      return navigate("/login");
    }
    if (!medicalReason.trim()) {
      toast.warn("Please enter a medical reason for the appointment");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime, medicalReason },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  return (
    docInfo && (
      <div className="p-6 sm:p-10">
            {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-8 items-center">
          <img
            className="w-72 h-72 rounded-lg object-cover border-2 hover:shadow-lg hover:scale-105 transition-all duration-300"
            src={docInfo.image}
            alt={docInfo.name}
          />
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-700 flex items-center gap-2">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </h2>
            <p className="text-gray-600 text-lg mt-2">
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <p className="text-gray-500 mt-4">{docInfo.about}</p>
            <p className="mt-4 text-lg text-blue-500 font-semibold">
              Fee: {currencySymbol}
              {docInfo.fees}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center mt-14 font-medium text-gray-700">
        <p className="text-4xl font-bold text-gray-900">Booking <span className="text-yellow-300">Slots</span></p>
  <div className="flex gap-3 items-center w-full overflow-x-scroll mt-10 text-center justify-center">
    {docSlots.length &&
      docSlots.map((item, index) => (
        <div
          onClick={() => setSlotIndex(index)}
          className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
            slotIndex === index
              ? "bg-gradient-to-r from-blue-500 to-blue-300 text-white font-semibold"
              : "border border-gray-200 text-gray-700"
          }`}
          key={index}
        >
          <p>{item[0] && daysOfweek[item[0].datetime.getDay()]}</p>
          <p>{item[0] && item[0].datetime.getDate()}</p>
        </div>
      ))}
  </div>

  <div className="flex items-center gap-3 w-full overflow-x-scroll mt-10">
    {docSlots.length &&
      docSlots[slotIndex].map((item, index) => (
        <p
          onClick={() => setSlotTime(item.time)}
          className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
            item.time === slotTime
              ? "bg-blue-400 text-white"
              : "text-gray-400 border border-gray-300"
          }`}
          key={index}
        >
          {item.time.toLowerCase()}
        </p>
      ))}
  </div>
          <textarea
            type="text"
            placeholder="Enter medical reason"
            value={medicalReason}
            onChange={(e) => setMedicalReason(e.target.value)}
            className="mt-8 p-4 border rounded-md w-full max-w-lg"
          />

          <button
            onClick={bookAppointment}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 hover:scale-105 mt-10 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Book an Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
