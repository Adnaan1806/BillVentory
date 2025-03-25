import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [relDoc, setRelDocs] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-12 px-6 py-12 mt-16">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Top Doctors to <span className='text-yellow-300'>Book</span> 
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Discover highly trusted doctors and book your appointments seamlessly.
        </p>
      </div>

      {/* Doctors Section */}
      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {relDoc.slice(0, 6).map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="bg-white border rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            {/* Doctor Image */}
            <div className="w-full h-48 flex items-center justify-center bg-white">
              <img
                className="h-full w-auto object-contain"
                src={item.image}
                alt={item.name}
              />
            </div>
            {/* Doctor Details */}
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm ${
                  item.available ? 'text-green' : 'text-gray-400'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.available ? 'bg-green' : 'bg-gray-400'
                  }`}
                ></span>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mt-2">
                {item.name}
              </h2>
              <p className="text-sm text-gray-600">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More Button */}
      <button
        onClick={() => {
          navigate('/doctors');
          scrollTo(0, 0);
        }}
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 hover:scale-105 mt-6 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        View More Doctors
      </button>
    </div>
  );
};

export default RelatedDoctors;
