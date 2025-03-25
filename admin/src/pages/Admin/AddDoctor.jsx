import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setEexperience] = useState("1 Year");
  const [about, setAbout] = useState("");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const {backendUrl, aToken} = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try{
        if(!docImg){
          return toast.error("Image not selected");
        }

        const formData = new FormData();

        formData.append("image", docImg)
        formData.append("name", name)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("experience", experience)
        formData.append("fees", Number(fees))
        formData.append("about", about)
        formData.append("speciality", speciality)
        formData.append("degree", degree)
        formData.append("address", JSON.stringify({line1:address1, line2:address2}))

        //console log formdata
        formData.forEach((value, key) => {
          console.log(`${key} : ${value}`);
        });

        const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers:{aToken}})

        if(data.success){
          toast.success(data.message);
          setDocImg(false);
          setName("");
          setEmail("");
          setPassword("");
          setEexperience("");
          setAbout("");
          setFees("");
          setSpeciality("");
          setDegree("");
          setAddress1("");
          setAddress2("");
        }
        else{
          toast.error(data.message);
        }

    }
    catch(err){
      toast.error(err.message);
      console.log(err);
    }

  };

  return (
    <form onSubmit={onSubmitHandler} className="flex w-full justify-center items-center min-h-screen p-9">
      <div className=" shadow-md px-7 py-6 border rounded-lg w-full max-w-3xl">
        <p className="text-3xl font-semibold text-gray-800 mb-6">Add Doctor</p>

        <div className="flex items-center gap-4 mb-8 text-gray-600">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              className="w-20 h-20 bg-gray-100 rounded-full object-cover"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload Doctor"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-gray-500">Upload Doctor's Picture</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-gray-800">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none"
              type="text"
              placeholder="Enter Doctor's Name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none"
              type="email"
              placeholder="Enter Email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none"
              type="password"
              placeholder="Enter Password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Years of Experience
            </label>
            <select
              onChange={(e) => setEexperience(e.target.value)}
              value={experience}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none"
              required
            >
              {[...Array(10).keys()].map((i) => (
                <option key={i} value={`${i + 1} Year`}>{`${
                  i + 1
                } Year`}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Consultation Fee
            </label>
            <input
              onChange={(e) => setFees(e.target.value)}
              value={fees}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none"
              type="number"
              placeholder="Enter Fee"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Specialization
            </label>
            <select
              onChange={(e) => setSpeciality(e.target.value)}
              value={speciality}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none"
              required
            >
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Education</label>
            <input
              onChange={(e) => setDegree(e.target.value)}
              value={degree}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none"
              type="text"
              placeholder="Enter Degree or Qualification"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              onChange={(e) => setAddress1(e.target.value)}
              value={address1}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none mb-2"
              type="text"
              placeholder="Address Line 1"
              required
            />
            <input
              onChange={(e) => setAddress2(e.target.value)}
              value={address2}
              className="border rounded-lg px-4 py-2 w-full focus:border-2 focus:border-black/80 focus:outline-none"
              type="text"
              placeholder="Address Line 2"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Biography</label>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border rounded-lg px-4 py-3 focus:border-2 focus:border-black/80 focus:outline-none"
            placeholder="Write a brief description about the doctor"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green transition-all duration-300 focus:outline-none"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
