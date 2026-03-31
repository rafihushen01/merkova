import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";
import { serverurl } from "../../App.jsx";
import { useNavigate } from "react-router-dom";

const SelleCentralrApproval = () => {
  const navigate = useNavigate();

  const [email, setemail] = useState("");
  const [otp, setotp] = useState("");
  const [step, setstep] = useState(1);
  const [loading, setloading] = useState(false);
  const [resendtimer, setresendtimer] = useState(0);

  /* ================= RESTORE STATE ================= */
  useEffect(() => {
    const savedstep = localStorage.getItem("sellerapproval_step");
    const savedemail = localStorage.getItem("sellerapproval_email");

    if (savedstep) setstep(Number(savedstep));
    if (savedemail) setemail(savedemail);
  }, []);

  useEffect(() => {
    localStorage.setItem("sellerapproval_step", step);
    localStorage.setItem("sellerapproval_email", email);
  }, [step, email]);

  /* ================= RESEND TIMER ================= */
  useEffect(() => {
    if (resendtimer === 0) return;

    const interval = setInterval(() => {
      setresendtimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendtimer]);

  /* ================= SEND OTP ================= */
  const sendotp = async () => {
    if (!email) return toast.error("Email required");

    try {
      setloading(true);
      const { data } = await axios.post(
        `${serverurl}/user/sellersendotp`,
        { email }
      );

      if (data.success) {
        toast.success(data.message);
        setstep(2);
        setresendtimer(30);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setloading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyotp = async () => {
    if (!otp) return toast.error("OTP required");

    try {
      setloading(true);
      const { data } = await axios.post(
        `${serverurl}/user/sellerverifyotp`,
        { email, otp }
      );

      if (data.success) {
        toast.success("Email verified successfully");

        localStorage.removeItem("sellerapproval_step");
        localStorage.removeItem("sellerapproval_email");

        setTimeout(() => {
          navigate("/sellersignup");
        }, 1500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setloading(false);
    }
  };

  /* ================= BACK HANDLER ================= */
  const handleback = () => {
    if (step === 2) {
      setstep(1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white px-4 relative">
      <Toaster />

      {/* BACK BUTTON */}
      <button
        onClick={handleback}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-2">
          Seller Central Verification
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          Secure email verification to access Seller Central
        </p>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Enter Your Verified Email(Recommended)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={sendotp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-4"
            >
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setotp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-green-500"
                />
              </div>

              <button
                onClick={verifyotp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
              </button>

              {/* RESEND OTP */}
              <div className="text-center pt-2">
                <button
                  onClick={sendotp}
                  disabled={resendtimer > 0}
                  className="text-sm flex items-center justify-center gap-2 text-blue-400 hover:text-blue-500 transition disabled:opacity-40 cursor-pointer mx-auto"
                >
                  <RefreshCcw size={14} />
                  {resendtimer > 0
                    ? `Resend OTP in ${resendtimer}s`
                    : "Resend OTP"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SelleCentralrApproval;
