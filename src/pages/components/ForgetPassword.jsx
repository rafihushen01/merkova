import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, Sparkles, Fingerprint } from 'lucide-react';
import { serverurl } from '../../App';
import toast, { Toaster } from 'react-hot-toast';

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });

  // Ultimate Toast Styling
  const notifySuccess = (msg) => toast.success(msg, {
    style: { background: '#1e293b', color: '#60a5fa', border: '1px solid #3b82f6' },
    iconTheme: { primary: '#3b82f6', secondary: '#fff' },
  });

  const notifyError = (msg) => toast.error(msg, {
    style: { background: '#1e293b', color: '#f87171', border: '1px solid #ef4444' },
  });

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${serverurl}/user/forgetpass`, { email: formData.email });
      if (res.data.success) {
        setStep(2);
        notifySuccess('Otp Send To Your Gmail!');
      }
    } catch (err) {
      notifyError(err.res?.data?.message || 'Verification Failed');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${serverurl}/user/resetpass`, formData);
      if (data.success) {
        notifySuccess('Merkova Account Secured! Redirecting...');
        setTimeout(() => window.location.href = '/signin', 2500);
      }
    } catch (err) {
      notifyError(err.response?.data?.message || 'Invalid Credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#00040a] flex items-center justify-center p-4 overflow-hidden relative font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[150px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
          
          {/* Brand Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="inline-block p-3 rounded-2xl bg-blue-500/10 mb-4 border border-blue-500/20"
            >
              <Fingerprint className="text-blue-400 w-8 h-8" />
            </motion.div>
            <h1 className="text-5xl font-black tracking-tighter text-white">
              MER<span className="text-blue-500">KOVA</span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3 text-blue-200/40 text-xs uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              <span>Merkova Security Always Thinking About Our Customers Comfort</span>
              <Sparkles className="w-3 h-3" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                onSubmit={handleSendOTP} 
                className="space-y-6"
              >
                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/50 group-focus-within:text-blue-400 transition-colors w-5 h-5" />
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-white/20"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>Request Secure OTP <ArrowRight className="w-5 h-5" /></>}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleResetPassword} 
                className="space-y-5"
              >
                <div className="group relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50 w-5 h-5" />
                  <input
                    type="number"
                    required
                    placeholder="6-Digit Auth Code"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500/50 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, otp: e.target.value})}
                  />
                </div>
                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50 w-5 h-5" />
                  <input
                    type="password"
                    required
                    placeholder="Vault New Password"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-500/50 outline-none transition-all"
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-cyan-600/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Password Reset '}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-blue-200/30 text-xs">
            © 2025 Merkova . All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;