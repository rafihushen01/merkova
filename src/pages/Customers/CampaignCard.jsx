import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Zap, Star } from "lucide-react";
import { serverurl } from "../../App";

/* ================= UTILS ================= */
const openlink = (link) => {
  if (!link) return;
  let url = link.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
  window.open(url, "_self");
};

/* ================= ANIMATION VARS ================= */
const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } },
  hover: { y: -6, scale: 1.03, transition: { duration: 0.3 } },
};

/* ================= BACKGROUND ================= */
const MerkovaBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden bg-[#020617]">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600 rounded-full blur-[120px]"
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[150px]"
    />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50"></div>
  </div>
);

/* ================= CAMPAIGN CARD ================= */
const CampaignCard = ({ sec }) => (
  <motion.div
    variants={cardVariants}
    initial="initial"
    whileInView="animate"
    whileHover="hover"
    viewport={{ once: true }}
    onClick={() => openlink(sec.navlink)}
    className="relative min-w-[260px] lg:min-w-[300px] group cursor-pointer flex-shrink-0"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-40 blur transition duration-500"></div>
    
    <div className="relative bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="relative h-36 overflow-hidden">
        <motion.img
          src={sec.image?.url}
          alt={sec.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
          {sec.title}
        </h3>
        <p className="text-sm text-white line-clamp-2 mb-2">{sec.subtitle}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
            ))}
          </div>
          <div className="text-blue-400 text-sm font-bold flex items-center gap-1">
            Explore <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ================= MAIN CAMPAIGN SLIDER ================= */
const MerkovaCampaignSlider = () => {
  const [campaigns, setCampaigns] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    axios.get(`${serverurl}/campaign/active`)
      .then(res => {
        if (res.data?.success) setCampaigns(res.data.campaigns || []);
      })
      .catch(console.error);
  }, []);

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.offsetWidth * 0.8;
    sliderRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  if (!campaigns.length) return null;

  return (
    <section className="relative w-full py-16 px-4 lg:px-12 overflow-hidden">
      <MerkovaBackground />

      <div className="max-w-[1400px] mx-auto space-y-20">
        {campaigns.map((camp, index) => (
          <div key={camp._id} className="w-full">
            {/* Header */}
            <div className="mb-6">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-blue-500 font-mono text-sm tracking-[0.3em] uppercase"
              >
                Campaign 0{index + 1}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-black text-white tracking-tight mt-2"
              >
                {camp.name}
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-2xl lg:text-3xl font-bold text-white/80 mt-1"
              >
                {camp.title}
              </motion.h2>
            </div>

            {/* Main Banner (horizontal & minimal height) */}
            {camp.banner?.url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="relative w-full h-60 lg:h-72 rounded-2xl overflow-hidden mb-10 group cursor-pointer"
                onClick={() => openlink(camp.navlink)}
              >
                <img
                  src={camp.banner.url}
                  alt={camp.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
               
              </motion.div>
            )}

            {/* Section Slider */}
            <div className="relative">
              <div className="flex justify-end gap-2 mb-2">
                <button
                  onClick={() => scroll("left")}
                  className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-blue-600 hover:border-blue-500 text-white transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-3 rounded-full border border-white/10 bg-white/5 hover:bg-blue-600 hover:border-blue-500 text-white transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
                style={{ scrollSnapType: "x mandatory" }}
              >
                <AnimatePresence>
                  {camp.sections
                    ?.filter(s => s.isactive !== false)
                    .sort((a, b) => a.position - b.position)
                    .map(sec => (
                      <div key={sec._id} style={{ scrollSnapAlign: "start" }}>
                        <CampaignCard sec={sec} />
                      </div>
                    ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default MerkovaCampaignSlider;
