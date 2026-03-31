import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, Loader2 } from "lucide-react";
import { serverurl } from "../../App.jsx";
import { useNavigate } from "react-router-dom";

const RelatedProducts = ({ itemid }) => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [items, setitems] = useState([]);

  useEffect(() => {
    const fetchrelated = async () => {
      try {
        const res = await axios.get(`${serverurl}/item/related/${itemid}`);
        setitems(res.data.relateditems || []);
      } catch (err) {
        console.error(err);
      } finally {
        setloading(false);
      }
    };
    fetchrelated();
  }, [itemid]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div className="mt-24">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Related Products
        </h2>
      
      </div>

      {/* ================= HORIZONTAL PREMIUM SCROLL ================= */}
      <div className="relative">
        <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
          {items.map((p) => {
            const img =
              p.colorvariants?.[0]?.images?.find(i => i.isprimary)?.url ||
              p.colorvariants?.[0]?.images?.[0]?.url ||
              "https://via.placeholder.com/500";

            return (
              <motion.div
                key={p._id}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => navigate(`/products/${p._id}`)}
                className="min-w-[280px] max-w-[280px] bg-gradient-to-b from-gray-900/90 to-black
                           rounded-3xl overflow-hidden shadow-2xl cursor-pointer
                           border border-white/5 hover:border-purple-500/40"
              >
                {/* ================= IMAGE ================= */}
                <div className="relative h-[260px] w-full overflow-hidden">
                  <img
                    src={img}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    draggable={false}
                  />

                  {/* DISCOUNT BADGE */}
                  {p.discountpercent > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      -{p.discountpercent}%
                    </div>
                  )}
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                    {p.title}
                  </h3>

                  {/* RATING */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.round(p.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      ({p.rating || 0})
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-400">
                      ৳ {p.currentprice}
                    </span>
                    <span className="text-sm line-through text-gray-500">
                      ৳ {p.baseprice}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FADE EDGES (PREMIUM TOUCH) */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black to-transparent" />
        <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black to-transparent" />
      </div>
    </div>
  );
};

export default RelatedProducts;
