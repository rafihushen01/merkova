import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { 
  FaCamera, FaUser, FaLock, FaEnvelope, FaShieldAlt, 
  FaCheckCircle, FaChevronRight, FaSave, FaMobileAlt, FaMapMarkerAlt,  FaMars,
  FaVenus,
  FaGenderless
} from "react-icons/fa";
import { serverurl } from "../App"; // Ensure this path is correct

const SellerProfile = () => {
  const { userData } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // ================= STATE MANAGEMENT =================
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("/default-avatar.png");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    gender: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    newpassword: "",
  });

  // Email Wizard State
  const [emailStep, setEmailStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  // ================= INITIAL LOAD =================
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        mobile: userData.mobile || "",
        gender: userData.gender || "",
        address: userData.address || "",
      });
      setPreview(
        userData.avatar ? `${serverurl}${userData.avatar}` : "/default-avatar.png"
      );
    }
  }, [userData]);

  // ================= API HELPERS =================
  const apiCall = async (payload) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${serverurl}/api/profile/update`,
        payload,
        { withCredentials: true }
      );
      toast.success(res.data.message, {
        style: { background: "#0f172a", color: "#38bdf8" },
        iconTheme: { primary: "#38bdf8", secondary: "#0f172a" },
      });
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation Failed", {
        style: { background: "#330000", color: "#ff4d4d" },
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLERS =================
  const handleUpdateProfile = () => apiCall({ action: "update_profile", ...formData });

  const handleChangePassword = async () => {
    const success = await apiCall({ action: "change_password", ...passwordData });
    if (success) setPasswordData({ oldpassword: "", newpassword: "" });
  };

  const handleEmailStep1 = async () => {
    const success = await apiCall({ action: "request_email_change" });
    if (success) setEmailStep(2);
  };

  const handleEmailStep2 = async () => {
    const success = await apiCall({ action: "verify_email_otp", otp });
    if (success) setEmailStep(3);
  };

  const handleEmailStep3 = async () => {
    const success = await apiCall({
      action: "confirm_new_email",
      email: newEmail,
      password: emailPassword,
    });
    if (success) {
      setEmailStep(1);
      setNewEmail("");
      setOtp("");
      setEmailPassword("");
    }
  };

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));

    const data = new FormData();
    data.append("avatar", file);

    try {
      const res = await axios.post(`${serverurl}/api/profile/avatar`, data, {
        withCredentials: true,
      });
      toast.success("Avatar Updated Successfully", {
        style: { background: "#0f172a", color: "#38bdf8" },
      });
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  // ================= ANIMATION VARIANTS =================
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-1000"></div>

      <Toaster position="bottom-right" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl bg-slate-800/50 backdrop-blur-2xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[800px] md:h-[600px]"
      >
        {/* ================= SIDEBAR ================= */}
        <div className="w-full md:w-1/3 bg-slate-900/60 p-8 flex flex-col items-center border-r border-slate-700/50">
          
          {/* Avatar Section */}
          <div className="relative group mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800">
              <img src={preview} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-500 p-2.5 rounded-full cursor-pointer hover:bg-blue-400 transition-colors shadow-lg">
              <FaCamera className="text-white text-sm" />
              <input type="file" hidden accept="image/*" onChange={handleAvatarUpdate} />
            </label>
          </div>

          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-1">
            {formData.name || "Seller Name"}
          </h2>
          <p className="text-slate-400 text-sm mb-8">Merkova Sellers</p>

          {/* Navigation Tabs */}
          <nav className="w-full space-y-2">
            {[
              { id: "profile", label: "Profile Details", icon: FaUser },
              { id: "security", label: "Security", icon: FaShieldAlt },
              { id: "account", label: "Account Settings", icon: FaEnvelope },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <tab.icon className="text-lg" />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="w-full md:w-2/3 p-8 md:p-12 relative overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* 1. PROFILE TAB */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaUser className="text-blue-400" /> Edit Profile
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup 
                    icon={FaUser} 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                  <InputGroup 
                    icon={FaMobileAlt} 
                    label="Mobile Number" 
                    value={formData.mobile} 
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
                  />
              <div className="md:col-span-2">
            <label className="text-xs uppercase text-slate-400 font-bold mb-3 block">
              Gender
            </label>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Male", value: "Male", icon: FaMars },
                { label: "Female", value: "Female", icon: FaVenus },
                { label: "Other", value: "Other", icon: FaGenderless },
              ].map((g) => (
                <button
                  key={g.value}
                  onClick={() =>
                    setFormData({ ...formData, gender: g.value })
                  }
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all
                    ${
                      formData.gender === g.value
                        ? "border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/30"
                        : "border-slate-700 hover:border-slate-500"
                    }`}
                >
                  <g.icon className="text-2xl" />
                  <span className="font-semibold">{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        
                      <InputGroup
            icon={FaMapMarkerAlt}
            label="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
                </div>

                <div className="pt-4 flex justify-end">
                  <SaveButton onClick={handleUpdateProfile} loading={loading} text="Save Changes" />
                </div>
              </motion.div>
            )}

            {/* 2. SECURITY TAB (Password) */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaShieldAlt className="text-blue-400" /> Security
                </h3>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <InputGroup 
                      type="password"
                      icon={FaLock} 
                      label="Current Password" 
                      value={passwordData.oldpassword} 
                      onChange={(e) => setPasswordData({...passwordData, oldpassword: e.target.value})} 
                    />
                    <InputGroup 
                      type="password"
                      icon={FaLock} 
                      label="New Password" 
                      value={passwordData.newpassword} 
                      onChange={(e) => setPasswordData({...passwordData, newpassword: e.target.value})} 
                    />
                  </div>
                  <div className="pt-6 flex justify-end">
                    <SaveButton onClick={handleChangePassword} loading={loading} text="Update Password" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. ACCOUNT TAB (Email Wizard) */}
            {activeTab === "account" && (
              <motion.div
                key="account"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" /> Email Settings
                </h3>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
                  {/* Progress Line */}
                  <div className="absolute top-0 left-0 h-1 bg-slate-700 w-full">
                    <motion.div 
                      className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                      initial={{ width: "33%" }}
                      animate={{ width: `${emailStep * 33.33}%` }}
                    />
                  </div>

                  <div className="pt-4">
                    {/* STEP 1: Request */}
                    {emailStep === 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-center py-8">
                        <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto text-blue-400 text-2xl mb-4 border border-blue-500/30">
                          <FaEnvelope />
                        </div>
                        <h4 className="text-xl font-semibold">Change Email Address</h4>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto">
                          We will send a verification code (OTP) to your current email address to verify your identity.
                        </p>
                        <button onClick={handleEmailStep1} className="btn-glow mt-4">
                          {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                      </motion.div>
                    )}

                    {/* STEP 2: Verify OTP */}
                    {emailStep === 2 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                         <h4 className="text-lg font-semibold text-blue-300">Verify Identity</h4>
                         <p className="text-slate-400 text-sm">Enter the OTP sent to your current email.</p>
                         <InputGroup 
                            icon={FaCheckCircle}
                            label="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                         />
                         <div className="flex gap-4 pt-4">
                            <button onClick={() => setEmailStep(1)} className="text-slate-400 hover:text-white text-sm">Cancel</button>
                            <SaveButton onClick={handleEmailStep2} loading={loading} text="Verify & Proceed" />
                         </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Confirm New Email */}
                    {emailStep === 3 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                         <h4 className="text-lg font-semibold text-green-400">Final Step</h4>
                         <p className="text-slate-400 text-sm">Enter your new email and current password to confirm.</p>
                         
                         <InputGroup 
                            icon={FaEnvelope}
                            label="New Email Address"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                         />
                         <InputGroup 
                            type="password"
                            icon={FaLock}
                            label="Confirm with Password"
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                         />
                         
                         <div className="flex gap-4 pt-4">
                            <button onClick={() => setEmailStep(1)} className="text-slate-400 hover:text-white text-sm">Cancel</button>
                            <SaveButton onClick={handleEmailStep3} loading={loading} text="Update Email" />
                         </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>

      {/* Styles Injection for specific glow buttons */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .btn-glow {
          @apply bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition-all duration-300 transform hover:-translate-y-1;
        }
      `}</style>
    </div>
  );
};

// ================= SUB-COMPONENTS =================

const InputGroup = ({ label, icon: Icon, type = "text", value, onChange }) => (
  <div className="space-y-2 group">
    <label className="text-xs uppercase tracking-wider text-slate-400 font-bold ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
        placeholder={`Enter ${label}`}
      />
    </div>
  </div>
);

const SaveButton = ({ onClick, loading, text }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? (
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ) : (
      <>
        {text} <FaChevronRight className="text-xs" />
      </>
    )}
  </button>
);

export default SellerProfile;