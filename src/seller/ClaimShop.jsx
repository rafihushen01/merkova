import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { serverurl } from "../App";

import { CheckCircle, Loader2 } from "lucide-react";
import { setShopData } from "../pages/redux/Shop";
import { useNavigate } from "react-router-dom";

const ClaimShop = () => {
  const dispatch = useDispatch();
  const [shopcode, setShopcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopVerified, setShopVerified] = useState(null);
 const navigate=useNavigate()
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!shopcode.trim()) {
      toast.error("Please enter your shop code");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${serverurl}/shop/verify-shopcode`, { shopcode },  { withCredentials: true });
      if (res.data?.success) {
        toast.success(res.data.message);
        setShopVerified(res.data.shop);
        dispatch(setShopData(res.data.shop));
      } else {
        toast.error(res.data?.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-purple-900 flex items-center justify-center p-5">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-3xl p-10 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-purple-900 mb-6 text-center">
          Claim Your Merkova Shop
        </h2>

        {!shopVerified ? (
          <form onSubmit={handleVerify} className="space-y-5">
            <input
              type="text"
              placeholder="Enter your shop code"
              value={shopcode}
              onChange={(e) => setShopcode(e.target.value.toUpperCase())}
              className="w-full border p-3 rounded-xl text-center font-semibold tracking-wider"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-purple-800 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify Shop"}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-5"
          >
            <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
            <h3 className="text-2xl font-semibold text-purple-800">
              Shop Verified!
            </h3>
            <p className="text-gray-600">
              Welcome, {shopVerified.owner.name}. You can now manage your shop.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold"
             onClick={()=>navigate("/")}

            >
              Go to Shop Dashboard
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ClaimShop;
