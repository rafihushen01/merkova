import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { serverurl } from "../../App";

const Homebannercard = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${serverurl}/homebanner`)
      .then((res) => {
        setBanners(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!banners.length) return;
    const timer = setInterval(() => nextSlide(), 20000);
    return () => clearInterval(timer);
  }, [banners, currentBannerIndex, currentImageIndex]);

  const nextSlide = () => {
    const active = banners[currentBannerIndex];
    if (currentImageIndex < active.images.length - 1) {
      setCurrentImageIndex((p) => p + 1);
    } else {
      setCurrentImageIndex(0);
      setCurrentBannerIndex((p) => (p === banners.length - 1 ? 0 : p + 1));
    }
  };

  const prevSlide = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((p) => p - 1);
    } else {
      const prevBanner =
        currentBannerIndex === 0 ? banners.length - 1 : currentBannerIndex - 1;
      setCurrentBannerIndex(prevBanner);
      setCurrentImageIndex(banners[prevBanner].images.length - 1);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-black rounded-3xl">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!banners.length) return null;

  const banner = banners[currentBannerIndex];
  const image = banner.images[currentImageIndex];

  /* ================= 100% GUARANTEED CLICK HANDLER ================= */
  const handleClick = () => {
    if (!banner.navigationlink) return;
    if (banner.navigationlink.startsWith("/")) {
      navigate(banner.navigationlink);
    } else {
      window.open(banner.navigationlink, "_blank");
    }
  };

  return (
    <section className="relative w-full max-w-[1800px] mx-auto h-[45vh] sm:h-[55vh] lg:h-[65vh] 2xl:h-[75vh] overflow-hidden rounded-[28px] rounded-t-none bg-black shadow-[0_30px_90px_rgba(0,0,0,0.25)] group">
      
      {/* ================= CLICKABLE FULL-BANNER LAYER ================= */}
      <div
        className="absolute inset-0 z-20 cursor-pointer"
        onClick={handleClick}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={image?.url}
            src={image?.url}
            alt={banner.title || "Home Banner"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 h-full flex items-center px-5 sm:px-10 lg:px-20 pointer-events-none">
        <div className="max-w-[760px]">
          <h1 className="text-white font-extrabold italic leading-tight text-[clamp(26px,6vw,90px)] mb-4 drop-shadow-[0_6px_20px_rgba(0,0,0,0.65)]">
            {banner.title}
          </h1>
          <p className="text-white text-[clamp(14px,2.2vw,22px)] leading-relaxed max-w-[90%] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            {banner.subtitle}
          </p>
        </div>
      </div>

      {/* ================= ARROWS ================= */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-5 h-5 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white/30 hover:scale-110">
        <ChevronLeft size={26} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-5 h-5 rounded-full bg-white/15 backdrop-blur-xl flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white/30 hover:scale-110">
        <ChevronRight size={26} />
      </button>

      {/* ================= DOT INDICATORS ================= */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentBannerIndex(index);
              setCurrentImageIndex(0);
            }}
            className={`h-[6px] rounded-full transition-all duration-500 cursor-pointer ${
              index === currentBannerIndex
                ? "w-8 bg-white shadow-[0_0_14px_rgba(255,255,255,1)]"
                : "w-3 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Homebannercard;
