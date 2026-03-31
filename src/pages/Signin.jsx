import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { serverurl } from "../App";
import logo from "../assets/Logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaShieldAlt, FaKey } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/User";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Auth } from "./utils/Firebase.jsx";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */
  const [step, setStep] = useState("LOGIN"); // LOGIN | OTP | SECRET
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [secretcode, setSecretcode] = useState("");

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      if (step === "OTP" || step === "SECRET") payload.otp = otp;
      if (step === "SECRET") payload.secretcode = secretcode;

      const res = await axios.post(`${serverurl}/user/signin`, payload, {
        withCredentials: true,
      });

      if (
        res.data.step === "USER_OTP_SENT" ||
        res.data.step === "SUPERADMIN_OTP_SENT"
      ) {
        setStep("OTP");
        setMessage(`🔐 OTP sent to ${formData.email}`);
        setLoading(false);
        return;
      }

      if (res.data.step === "SECRET_CODE_REQUIRED") {
        setStep("SECRET");
        setMessage("✅ OTP verified. Enter Secret Code.");
        setLoading(false);
        return;
      }

      if (res.data.success) {
        dispatch(setUserData(res.data.user));
        setMessage("🚀 Welcome back to Merkova");
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  const handlegooglesignin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(Auth, provider);

      const res = await axios.post(
        `${serverurl}/user/googlelogin`,
        { name: result.user.displayName, email: result.user.email },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUserData(res.data.user));
        navigate("/");
      }
    } catch {
      setMessage("Google Signin failed");
    }
  };

  /* ---------------- PARTICLES ---------------- */
  const particles = Array.from({ length: 40 });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-500 blur-2xl opacity-20"
          initial={{
            x: Math.random() * 1500,
            y: Math.random() * 800,
            scale: Math.random() * 0.6 + 0.4,
          }}
          animate={{ y: [null, Math.random() * -300], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: Math.random() * 12 + 8, repeat: Infinity }}
          style={{ width: 120, height: 120 }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/10" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          {/* HEADER */}
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
            <h1 className="text-3xl font-bold text-white mt-4">
              Welcome Back to Merkova
            </h1>
            <p className="text-purple-300/60 text-xs mt-2 uppercase tracking-widest">
              Shop Like a Billionaire
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === "LOGIN" && (
              <>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email address"
                  className="w-full bg-slate-950/50 border border-purple-500/30 rounded-xl px-4 py-4 text-white outline-none"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="w-full bg-slate-950/50 border border-purple-500/30 rounded-xl px-4 py-4 text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </>
            )}

            {step === "OTP" && (
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full bg-slate-950/50 border border-cyan-500/40 rounded-xl px-4 py-4 text-white text-center text-xl"
              />
            )}

            {step === "SECRET" && (
              <input
                type="password"
                value={secretcode}
                onChange={(e) => setSecretcode(e.target.value)}
                placeholder="Secret Code"
                className="w-full bg-slate-950/50 border border-purple-500/40 rounded-xl px-4 py-4 text-white"
              />
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 py-4 rounded-xl font-bold text-white"
            >
              {loading
                ? "Processing..."
                : step === "LOGIN"
                ? "Sign In"
                : step === "OTP"
                ? "Verify OTP"
                : "Authorize"}
            </motion.button>
          </form>

          {message && (
            <p className="mt-6 text-center text-cyan-400 text-sm">{message}</p>
          )}

          {step === "LOGIN" && (
            <>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handlegooglesignin}
                  className="p-3 bg-white/10 rounded-xl"
                >
                  <FcGoogle size={24} />
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-slate-400">
                New here?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-purple-400 cursor-pointer"
                >
                  Join Merkova
                </span>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
