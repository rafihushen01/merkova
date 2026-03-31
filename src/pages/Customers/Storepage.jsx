import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Package,
  Flame,
  Grid3X3,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Loader2,
  Users,
  Store,
  Heart,
  
} from "lucide-react";
import { serverurl } from "../../App.jsx";

const Storepage = () => {
  const { shopid } = useParams();
  const navigate = useNavigate();

  const [shop, setshop] = useState(null);
  const [products, setproducts] = useState([]);
  const [loading, setloading] = useState(true);
  const [search, setsearch] = useState("");
  const [activecategory, setactivecategory] = useState("All");
  const [following, setfollowing] = useState(false);

  // ================= FETCH SHOP =================
  useEffect(() => {
    const fetchshop = async () => {
      try {
        setloading(true);
        const res = await axios.get(`${serverurl}/item/getshopbyid/${shopid}`);
        setshop(res.data.shop);
        setproducts(res.data.products || []);
        // Check if current user follows this shop
        const userFollowedShops = res.data.userFollowedShops || [];
        setfollowing(userFollowedShops.includes(shopid));
      } catch (err) {
        console.error("STORE FETCH ERROR", err);
      } finally {
        setloading(false);
      }
    };

    if (shopid) fetchshop();
  }, [shopid]);

  // ================= DERIVED DATA =================
  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.categoryname));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredproducts = useMemo(() => {
    return products.filter(p => {
      const matchcat = activecategory === "All" || p.categoryname === activecategory;
      const matchsearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchcat && matchsearch;
    });
  }, [products, activecategory, search]);

  const topselling = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.totalsold || 0) - (a.totalsold || 0))
      .slice(0, 5);
  }, [products]);

  // ================= FOLLOW / UNFOLLOW =================
const handleFollowToggle = async () => {
  try {
    const endpoint = following ? "/shop/unfollow" : "/shop/follow";
    const res = await axios.post(`${serverurl}${endpoint}`, { shopId: shopid }, { withCredentials: true });

    // Update following state and totalfollowers dynamically
    setfollowing(res.data.followed);
    setshop(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        totalfollowers: res.data.totalfollowers
      }
    }));
  } catch (err) {
    console.error("FOLLOW TOGGLE ERROR", err);
    alert(err.response?.data?.message || "Failed to toggle follow");
  }
};



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={44} />
      </div>
    );
  }

  if (!shop) return <div className="min-h-screen flex items-center justify-center text-white">Shop not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* ================= HERO ================= */}
      <div className="relative">
        <img src={shop.media.coverimage} className="w-full h-[360px] object-cover" />
        <div className="absolute inset-0 " />
        <div className="absolute bottom-6 left-6 flex gap-6 items-center">
          <img
            src={shop.media.profileimage}
            className="w-28 h-28 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {shop.name}
              {shop.badges?.verifiedcompany && <BadgeCheck className="text-blue-500" />}
            </h1>
            <p className="font-semibold max-w-xl">{shop.description}</p>
            <div className="flex gap-4 mt-2 text-sm flex-wrap">
              <span className="flex items-center gap-1 font-semibold"><Star size={14} /> {shop.rating?.average || 0}</span>
              <span className="flex items-center gap-1 font-semibold"><Package size={14} /> {shop.metrics.totalproducts} Products</span>
              <span className="flex items-center gap-1 font-semibold"><Users size={14} /> {shop.metrics.totalfollowers} Followers</span>
              <span className="flex items-center gap-1 font-semibold"><Store size={14} /> {shop.storetype}</span>
            </div>
            <button
              onClick={handleFollowToggle}
              className={`mt-3 px-4 py-2 rounded-lg font-semibold transition ${
                following ? "bg-red-600 hover:bg-red-500" : "bg-purple-600 hover:bg-purple-500"
              }`}
            >
              {following ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= SHOP INFO STRIP ================= */}
      <div className="px-6 py-6 bg-slate-900 flex flex-wrap gap-8 text-sm">
        <div className="flex items-center gap-2"><MapPin /> {shop.address.city}, {shop.address.district}</div>
        <div className="flex items-center gap-2"><ShieldCheck /> {shop.approvalstatus}</div>
        <div>Capacity: {shop.ShopCapacity}</div>
        <div>Special For: {shop.specialfor}</div>
      </div>

      {/* ================= SEARCH + CATEGORY ================= */}
      <div className="px-6 mt-8 flex flex-wrap gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 opacity-60" size={18} />
          <input
            value={search}
            onChange={e => setsearch(e.target.value)}
            placeholder="Search products in this shop"
            className="w-full bg-slate-800 rounded-xl py-2 pl-10 pr-4 outline-none text-white"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setactivecategory(cat)}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer transition ${
                activecategory === cat ? "bg-purple-600" : "bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TOP SELLING ================= */}
      {topselling.length > 0 && (
        <div className="px-6 mt-10">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4"><Flame /> Top Selling</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {topselling.map(item => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-900 rounded-xl p-3 cursor-pointer"
                onClick={() => navigate(`/products/${item._id}`)}
              >
                <img src={item.colorvariants?.[0]?.images?.[0]?.url} className="w-full h-32 object-cover rounded-lg" />
                <p className="text-sm mt-2 truncate">{item.title}</p>
                <p className="text-purple-400 font-semibold"> ৳{item.currentprice}</p>
                   
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ALL PRODUCTS ================= */}
      <div className="px-6 mt-12 pb-16">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-6"><Grid3X3 /> All Products</h2>
        <AnimatePresence>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredproducts.map(item => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                className="bg-slate-900 rounded-2xl p-4 cursor-pointer"
                onClick={() => navigate(`/products/${item._id}`)}
              >
                <img
                  src={item.colorvariants?.[0]?.images?.[0]?.url}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h3 className="mt-3 text-sm font-medium line-clamp-2">{item.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-purple-400 font-semibold"> ৳  {item.currentprice}</span>
                  <span className="text-xs font-semibold">⭐ {item.rating || 0}</span>
  
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Storepage;
