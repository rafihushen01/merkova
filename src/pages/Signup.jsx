import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { serverurl } from "../App.jsx";
import { FcGoogle } from "react-icons/fc";
import {
  FaEye, FaEyeSlash, FaMars, FaVenus, FaTransgender,
  FaChevronRight, FaShieldAlt, FaArrowLeft
} from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Auth } from "./utils/Firebase.jsx";
import { useNavigate, Link } from "react-router-dom";
import merkovaddress from "../pages/Bangladeshiaddress.jsx";
import logo from "../assets/Logo.png";

const Signup = () => {
  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */
  const [step, setstep] = useState("send-otp");
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");
  const [showpassword, setshowpassword] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    mobile: "",
    gender: "Male",
    address: { division: "", district: "", upazila: "", fulladdress: "", zip: "" },
  });

  /* ---------------- BACK BUTTON LOGIC ---------------- */
  const handleBack = () => {
    if (step === "verify-otp") setstep("send-otp");
    else if (step === "complete-profile") setstep("verify-otp");
  };

  /* ---------------- ADDRESS ---------------- */
  const handleDivisionChange = (e) => {
    const divName = e.target.value;
    const selectedDiv = merkovaddress.find((d) => d.name === divName);
    setformdata({ ...formdata, address: { ...formdata.address, division: divName, district: "", upazila: "" } });
    setDistricts(selectedDiv ? selectedDiv.districts : []);
    setUpazilas([]);
  };

  const handleDistrictChange = (e) => {
    const disName = e.target.value;
    const selectedDis = districts.find((d) => d.name === disName);
    setformdata({ ...formdata, address: { ...formdata.address, district: disName, upazila: "" } });
    setUpazilas(selectedDis ? selectedDis.upazilas : []);
  };

  const handlechange = (e) => setformdata({ ...formdata, [e.target.name]: e.target.value });
  const handleaddress = (e) => setformdata({ ...formdata, address: { ...formdata.address, [e.target.name]: e.target.value } });

  /* ---------------- SUBMIT ---------------- */
  const handlesubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    setmessage("");

    try {
      let payload = {};
      if (step === "send-otp") payload = { step: "send-otp", name: formdata.name, email: formdata.email, password: formdata.password };
      if (step === "verify-otp") payload = { step: "verify-otp", email: formdata.email, otp: formdata.otp };
      if (step === "complete-profile") payload = {
        step: "complete-profile",
        email: formdata.email,
        mobile: formdata.mobile,
        gender: formdata.gender,
        address: [formdata.address],
      };

      const res = await axios.post(`${serverurl}/user/signup`, payload, { withCredentials: true });
      setmessage(res.data.message);

      if (step === "send-otp") setstep("verify-otp");
      else if (step === "verify-otp") setstep("complete-profile");
      else setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      setmessage(err.response?.data?.message || "Merkova system interruption");
    } finally {
      setloading(false);
    }
  };

  /* ---------------- GOOGLE ---------------- */
  const handlegooglesignup = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(Auth, provider);
    await axios.post(`${serverurl}/user/googlesignup`, {
      name: result.user.displayName,
      email: result.user.email,
    }, { withCredentials: true });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center relative overflow-hidden p-6">

      <div className="absolute inset-0 z-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{ y: [null, -1200], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 20 + Math.random() * 10, repeat: Infinity }}
          />
        ))}
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl bg-[#0d1117]/65 backdrop-blur-2xl border border-blue-500/30 rounded-[4rem] p-10 shadow-[0_0_90px_rgba(59,130,246,0.25)]"
      >

        {/* BACK BUTTON */}
        {step !== "send-otp" && (
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 flex items-center gap-2 text-xs text-slate-400 hover:text-white"
          >
            <FaArrowLeft /> Back
          </button>
        )}

        {/* BRAND */}
        <div className="text-center mb-10">
           <motion.div
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.8 }}
                        className="w-24 h-24 mx-auto cursor-pointer"
                      >
                        <img
                          src={logo}
                          alt="Merkova"
                          className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(139,92,246,0.8)] cursor-pointer"
                        />
                      </motion.div>
          <h1 className="text-4xl font-black text-white mt-4">
            MERKO<span className="text-blue-500">VA</span>
          </h1>
          <p className="text-blue-400/60 mt-4 text-[10px] uppercase tracking-[0.4em] font-bold">
            Join us today! Starts Shopping with bangladeshi most trusted & massive ecommerce platform
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handlesubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === "send-otp" && (
              <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <input name="name" placeholder="Full Name" onChange={handlechange} className="merkova-input" />
                <input name="email" type="email" placeholder="Email Address" onChange={handlechange} className="merkova-input" />
                <div className="relative">
                  <input type={showpassword ? "text" : "password"} name="password" placeholder="Create a Strong Password" onChange={handlechange} className="merkova-input" />
                  <button type="button" onClick={() => setshowpassword(!showpassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-400">
                    {showpassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button type="button" onClick={handlegooglesignup} className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-4 rounded-2xl text-white hover:bg-white/10">
                  <FcGoogle size={22} />
                  <span className="font-bold text-xs tracking-widest">CONTINUE WITH GOOGLE</span>
                </button>

                {/* 🔐 PRIVACY & SIGNIN */}
                <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                  By continuing, you agree to Merkova’s{" "}
                  <Link to="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link>{" "}
                  &{" "}
                  <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>.
                </p>

                <p className="text-center text-xs text-slate-400">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-blue-500 font-bold hover:underline">Sign In</Link>
                </p>
              </motion.div>
            )}

            {step === "verify-otp" && (
              <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                <FaShieldAlt className="text-blue-500 text-4xl mx-auto animate-pulse" />
                <input name="otp" placeholder="• • • • • •" onChange={handlechange} className="merkova-input text-center text-2xl tracking-[0.7em]" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-6 rounded-3xl font-black tracking-[0.3em] text-white flex justify-center items-center gap-3"
          >
            {loading ? "PROCESSING..." : "NEXT"}
            <FaChevronRight />
          </motion.button>
        </form>

        {message && (
          <p className="mt-6 text-center text-blue-400 text-[10px] font-mono uppercase">
            {message}
          </p>
        )}
      </motion.div>

      <style jsx>{`
        .merkova-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border-radius: 1.25rem;
          background: rgba(2,6,23,0.8);
          border: 1px solid rgba(59,130,246,0.3);
          color: white;
          outline: none;
        }
        .merkova-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 25px rgba(59,130,246,0.4);
        }
      `}</style>
    </div>
  );
};

export default Signup;
