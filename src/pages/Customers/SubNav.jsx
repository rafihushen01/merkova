import { GrLogout } from "react-icons/gr";
import React, { useEffect, useState } from "react";
import { Truck, RotateCcw, Smartphone, Gift, LogIn, ChevronRight ,} from "lucide-react";
import { serverurl } from "../../App";
import { useDispatch } from "react-redux";
import { clearuser } from "../redux/User";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Subnav = () => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Premium Merkova Golden Deals
  const offers = [
    "৳5,000 Cashback on iPhone 16 Pro",
    "Flash Sale: 90% OFF Merkova Originals",
    "Free Delivery all over Bangladesh!",
    "৳1,000 Off on your first order"
    
  ];
  useEffect(() => {
    const offerTimer = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 3000); // Transitions every 3 seconds to match Temu style

    return () => clearInterval(offerTimer);
  }, [offers.length]);
 const handlelogout = async () => {
  try {
    const res = await axios.post(
      `${serverurl}/user/signout`,
      {},
      { withCredentials: true }
    );

  if (res?.data?.success) {
  toast.success("Seller Logout Successful ");



  setTimeout(() => {
      dispatch(clearuser());
    navigate("/signin");
  }, 500);
}

  } catch (error) {
    console.log(error?.response?.data);
    alert(error?.response?.data?.message || "Logout failed");
  }
};
  return (
    <div className="fixed top-0 left-0 w-full z-[100] bg-black border-b border-[#D4AF37]/30 select-none">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 md:px-6 h-[40px] md:h-[48px]">
        
        {/* Left Side: Essentials (Hidden on small mobile to give center space) */}
        <div className="hidden sm:flex items-center gap-4 text-[#D4AF37] font-medium text-xs">
          <div className="flex items-center gap-1.5 hover:text-white transition-all cursor-pointer">
            <Truck size={14}  />
            <span>Fastest BD Delivery</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-white transition-all cursor-pointer group">
            <Smartphone size={14} />
            <span className="hidden lg:inline group-hover:underline">Get Merkova App</span>
          </div>
        </div>

        {/* Center: Vertical Sliding Golden Offers (Inspired by Temu) */}
        <div className="flex-1 flex justify-center items-center h-full relative overflow-hidden">
          <div className="flex flex-col items-center justify-center w-full">
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`absolute w-full flex justify-center items-center gap-2 transition-all duration-700 ease-in-out
                ${index === currentOfferIndex 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-full pointer-events-none"}`}
              >
                <Gift size={14} className="text-[#D4AF37]" />
                <span className="text-[#D4AF37] font-bold text-[10px] md:text-sm tracking-wide uppercase text-center">
                  {offer}
                </span>
                <ChevronRight size={14} className="text-[#D4AF37] hidden xs:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Identity & Returns */}
        <div className="flex items-center gap-3 md:gap-6 ml-2">
          {/* Free Returns: Hidden on mobile to keep it clean */}
          <div className="hidden md:flex items-center gap-1.5 text-[#D4AF37] hover:text-white cursor-pointer text-xs">
            <RotateCcw size={14} />
            <span>Free Returns</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[#D4AF37] hover:text-white cursor-pointer text-xs">
            <GrLogout size={14} />
            <span onClick={handlelogout}>Logout</span>
          </div>
               <div className="hidden md:flex items-center gap-1.5 text-[#D4AF37] hover:text-white cursor-pointer text-xs">
            
            <span>Helps & Merkova Call Center</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 border-l border-[#D4AF37]/40 pl-3 md:pl-6">
            <a href="/signin" className="flex items-center gap-1 text-[#D4AF37] hover:text-white transition-all text-[11px] md:text-xs font-bold whitespace-nowrap">
              <LogIn size={14} className="sm:hidden" />
              <span className="hidden sm:inline">Sign In</span>
            </a>
            <a href="/signup" className="bg-[#D4AF37] hover:bg-[#F5E050] text-black px-3 py-1 md:px-5 md:py-1.5 rounded-full text-[10px] md:text-xs font-black transition-transform active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              JOIN
            </a>
          </div>
        </div>
      </div>

      {/* The "Golden Line" Animation */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

      <style jsx>{`
        /* Responsive tweaks for iPhone X and small devices */
        @media (max-width: 375px) {
          .text-[10px] { font-size: 9px; }
        }
      `}</style>
    </div>
  );
};

export default Subnav;