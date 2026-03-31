import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { serverurl } from "../App";
import {
  FaEye,
  FaEyeSlash,
  FaUserAlt,
  FaLock,
  FaPhoneAlt,
  FaVenusMars,
  FaEnvelope,
} from "react-icons/fa";
import logo from "../assets/Logo.png";

/* ================= ANIMATIONS ================= */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 },
  },
};

const SellerSignup = () => {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "Male",
    address: {
      city: "",
      state: "",
      fulladdress: "",
    },
  });

  const [showpassword, setshowpassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleaddress = (e) => {
    setformdata({
      ...formdata,
      address: { ...formdata.address, [e.target.name]: e.target.value },
    });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setmessage("");

    try {
      const payload = { ...formdata, address: [formdata.address] };

      const res = await axios.post(
        `${serverurl}/user/sellersignup`,
        payload,
        { withCredentials: true }
      );

      setmessage(res.data.message || "Seller Account Created Successfully!");

      if (res.data.success) {
        setTimeout(() => (window.location.href = "/signin"), 2000);
      }
    } catch (err) {
      setmessage(err.response?.data?.message || "Merkova server unreachable");
    } finally {
      setloading(false);
    }
  };

  const particles = Array.from({ length: 25 });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020617] overflow-hidden px-4 py-12">

      {/* ================= BACKGROUND PARTICLES ================= */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 -z-10 pointer-events-none rounded-full bg-blue-500 blur-xl opacity-20"
          initial={{
            x: Math.random() * 2000,
            y: Math.random() * 1200,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{ y: [0, -200, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{
            duration: Math.random() * 12 + 12,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: Math.random() * 120 + 60,
            height: Math.random() * 120 + 60,
          }}
        />
      ))}

      {/* ================= GLOWS ================= */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-600/10 blur-[160px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-cyan-600/10 blur-[160px] -z-10 pointer-events-none" />

      {/* ================= CARD ================= */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          relative z-10 w-full
          max-w-[95%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl
          bg-slate-900/40 backdrop-blur-3xl
          border border-white/10
          p-5 sm:p-8 md:p-10 lg:p-12
          rounded-[28px] sm:rounded-[36px] lg:rounded-[40px]
          shadow-2xl overflow-hidden
        "
      >

        {/* ================= SCAN LIGHT ================= */}
        <motion.div
          aria-hidden
          animate={{ left: ["-120%", "220%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 -z-10 w-full transform -skew-x-12 
                     bg-gradient-to-r from-transparent via-blue-400/10 to-transparent
                     pointer-events-none"
        />

        {/* ================= HEADER ================= */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Merkova"
            className="
              mx-auto mb-6
              w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32
              h-auto
              drop-shadow-[0_0_25px_rgba(59,130,246,0.45)]
            "
          />

          <h1 className="
            text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl
            font-black text-white uppercase tracking-tight
          ">
            Become a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Merkova Seller
            </span>
          </h1>

          <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-blue-300/60 font-bold">
            Grow your business with Merkova
          </p>
            <p className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-blue-300/60 font-bold">
             Start Selling on Thousands of Active buyer
          </p>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handlesubmit} className="space-y-4">

          {/* Name + Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
            
              <input name="name" onChange={handlechange} required placeholder="Seller Name" className="input-style pl-12" />
            </div>

            <div className="relative">
              
              <input type="email" name="email" onChange={handlechange} required placeholder="Email Address" className="input-style pl-12" />
            </div>
          </div>

          {/* Mobile + Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              
              <input name="mobile" onChange={handlechange} placeholder="Mobile Number" className="input-style pl-12" />
            </div>

            <div className="relative">
             
              <input
                type={showpassword ? "text" : "password"}
                name="password"
                onChange={handlechange}
                required
                placeholder="Password"
                className="input-style pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setshowpassword(!showpassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showpassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
              <FaVenusMars /> Gender
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setformdata({ ...formdata, gender: g })}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    formdata.gender === g
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-950/40 text-slate-500"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <input name="city" onChange={handleaddress} placeholder="City" className="input-style" />
              <input name="state" onChange={handleaddress} placeholder="State" className="input-style" />
            </div>
            <textarea name="fulladdress" onChange={handleaddress} placeholder="Full Address" className="input-style h-20 resize-none" />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 py-4 rounded-2xl font-black uppercase tracking-widest text-sm"
          >
            {loading ? "Creating Seller Account..." : "Become a Seller"}
          </motion.button>
        </form>

        {message && (
          <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
            {message}
          </p>
        )}
      </motion.div>

      {/* ================= SHARED STYLES ================= */}
      <style>{`
        .input-style {
          width: 100%;
          background: rgba(2,6,23,0.5);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 1rem;
          padding: 0.875rem 1rem;
          color: white;
          outline: none;
        }
        .input-style:focus {
          border-color: rgba(34,211,238,0.6);
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(59,130,246,0.5);
        }
      `}</style>
    </div>
  );
};

export default SellerSignup;
