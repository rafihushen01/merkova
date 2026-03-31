import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaShoppingCart,
  FaUserAlt,
  FaHeadset,
  FaGlobe,
  FaChevronRight,
  FaFire,
  FaBolt,
  FaCrown,
  FaHistory,
  FaMobileAlt,
  FaStar,
  FaRegHeart,
  FaGift,
} from "react-icons/fa";
import { serverurl } from "../App.jsx";
// --- MERKOVA ASSET ENGINE ---
// Women's Imports
import tshirt from "../asset/Ment-shirt.avif"; // Note: User labeled as tshirt but placed in Mens logic
import WomenSweater from "../assets/Curve sweater.avif";
// import womenabaya from "../assets/Womes Abaya.jpg";
import womenburqa from "../assets/Womens-burqa.jpg";
// import womenhijab from "../assets/Womens hijab.jpg";
import womentshirt from "../assets/Womentshirt.avif";
import sweatshirt from "../assets/Womens sheatshirt.jpg";
import womenpant from "../assets/WomenPant.avif";
import womensaree from "../assets/Women-saree.jpg";
import womenpartydress from "../assets/WomenParty.avif";
import womenjumpsuits from "../assets/WomenJump.avif";
import womentop from "../assets/TankTop.avif";
import womenunderwear from "../assets/Womens underwear.jpg";
import womenlingerie from "../assets/Womens lingerie.jpg";
import womensbra from "../assets/Womens-bra.jpg";
import womennightwear from "../assets/Womens-nightwear.jpg";
import womenslipper from "../assets/Womens slipper.jpg";
import womenleggis from "../assets/Womensleggis.avif";
import womensportsbra from "../assets/WomensSportsBra.avif";
import womenstwopiece from "../assets/WomensTwopiece.avif";
import womenscosplay from "../assets/Womenscosplay.avif";
import axios from "axios";
// Men's Imports
import Mensjeans from "../asset/Mensjeans.avif";
import Menspolo from "../asset/Menspolo.avif";
import mensbaggy from "../asset/Mensbaggy.avif";
import mensjeansshort from "../asset/Mensdenimjeans.avif";
import menswimshorts from "../asset/Mensswimshorts.avif";
import menshoodie from "../asset/Menshoodie.avif";
import menssweatshirt from "../asset/Menssweatshirt.jpg";
import mensunderwear from "../assets/Mens underwear.jpg";
import mensthong from "../assets/Mens-thong.jpg";
import mensbeachcombo from "../asset/Mens Combo Beach.avif";
import menssleavless from "../assets/Mens sealevless t-shirt.jpg";
import { clearuser } from "../pages/redux/User.js";
import mensaccerssories from "../assets/Mens accerrios.jpg";
import mensbelt from "../assets/Mens-belts.jpg";
import mensofficedress from "../assets/Mens office.avif";
import menscargopants from "../assets/Mens cargo.avif";
import mensjogger from "../assets/Mens Jogger.jpg";
import menssocks from "../assets/Mens socks.jpg";
import menstouser from "../assets/Mens touser.jpg"; // Corrected spelling typo from source
import mensbag from "../assets/Mens Bag.jpg";
import toast from "react-hot-toast";
// Other Imports
import kitchen from "../asset/Kitchen.avif";
import smartwatches from "../assets/Menssmartwatch.webp";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const MERKOVA_DATA = [
  {
    id: "w-clothing",
    name: "Women's Clothing",
    featured: { name: "Winter Sale", discount: "Up to 80% Off" },
    groups: [
      {
        title: "Modest & Ethnic Wear",
        items: [
          // { name: "Women Abaya", img: womenabaya, hot: true },
          { name: "Women Burqa", img: womenburqa },
          // { name: "Womens Hijab", img: womenhijab },
          { name: "Womens Saree", img: womensaree, hot: true },
        ],
      },
      {
        title: "Daily Essentials",
        items: [
          { name: "Women Sweater", img: WomenSweater, hot: true },
          { name: "Womens T-Shirt", img: womentshirt },
          { name: "Womens SweatShirt", img: sweatshirt },
          { name: "Womens Pant", img: womenpant },
          { name: "Womens Top & Tank", img: womentop },
          { name: "Women Leggis", img: womenleggis },
        ],
      },
      {
        title: "Intimates & Nightwear",
        items: [
          { name: "Womens Underwear", img: womenunderwear },
          { name: "Womens Lingerie", img: womenlingerie, hot: true },
          { name: "Womens Bra", img: womensbra },
          { name: "Women Nightwear", img: womennightwear },
          { name: "Womens SportsBra", img: womensportsbra },
        ],
      },
      {
        title: "Specialty & Party",
        items: [
          { name: "Womens Partydress", img: womenpartydress, hot: true },
          { name: "Womens Jumpsuits", img: womenjumpsuits },
          { name: "Womens TwoPiece", img: womenstwopiece },
          { name: "Womens Cosplay", img: womenscosplay },
          { name: "Womens Slipper", img: womenslipper },
        ],
      },
    ],
  },
  {
    id: "m-clothing",
    name: "Men's Clothing",
    groups: [
      {
        title: "Top Wear",
        items: [
          { name: "Mens T-Shirts", img: tshirt, hot: true },
          { name: "Mens Polo Shirts", img: Menspolo },
          { name: "Mens Hoodie", img: menshoodie },
          { name: "Mens Sweatshirt", img: menssweatshirt },
          { name: "Sleavless T-Shirt", img: menssleavless },
        ],
      },
      {
        title: "Bottom Wear",
        items: [
          { name: "Mens Jeans", img: Mensjeans, hot: true },
          { name: "Mens Baggy Pants", img: mensbaggy },
          { name: "Mens Jeans Shorts", img: mensjeansshort },
          { name: "Mens Cargo Pants", img: menscargopants },
          { name: "Mens Jogger", img: mensjogger },
          { name: "Mens Trousers", img: menstouser },
        ],
      },
      {
        title: "Underwear & Lifestyle",
        items: [
          { name: "Mens Underwear", img: mensunderwear },
          { name: "Mens Thong", img: mensthong },
          { name: "Mens Swim Shorts", img: menswimshorts, hot: true },
          { name: "Combo Beach Set", img: mensbeachcombo },
          { name: "Office Wear", img: mensofficedress },
        ],
      },
      {
        title: "Accessories",
        items: [
          { name: "Mens Accessories", img: mensaccerssories },
          { name: "Mens Belt", img: mensbelt },
          { name: "Mens Socks", img: menssocks },
          { name: "Mens Bag", img: mensbag, hot: true },
        ],
      },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    groups: [
      {
        title: "Wearables & Tech",
        items: [
          { name: "Smart Watches", img: smartwatches, hot: true },
          {
            name: "Wireless Buds",
            img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150",
          },
        ],
      },
    ],
  },
  {
    id: "home",
    name: "Home & Kitchen",
    groups: [
      {
        title: "Organization",
        items: [
          { name: "Kitchen Storage", img: kitchen, hot: true },
          {
            name: "Doi Maker",
            img: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=150",
          },
        ],
      },
    ],
  },
  {
    id: "beauty",
    name: "Beauty & Health",
    groups: [
      {
        title: "Skincare Essentials",
        items: [
          {
            name: "Serums",
            img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150",
          },
        ],
      },
    ],
  },
  {
    id: "toys",
    name: "Toys & Games",
    groups: [
      {
        title: "Trending",
        items: [
          {
            name: "RC Cars",
            img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=150",
          },
        ],
      },
    ],
  },
  {
    id: "jewelry",
    name: "Jewelry",
    groups: [
      {
        title: "Luxury",
        items: [
          {
            name: "Gold Chains",
            img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150",
          },
        ],
      },
    ],
  },
  {
    id: "pets",
    name: "Pet Supplies",
    groups: [
      {
        title: "Dogs",
        items: [
          {
            name: "Smart Collars",
            img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150",
          },
        ],
      },
    ],
  },
];
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
const MerkovaNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(MERKOVA_DATA[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
 const dispatch=useDispatch()
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-[9999] font-sans shadow-2xl">
      {/* TIER 1: GLOBAL BAR */}
      <div className="bg-[#020617] text-white py-2 px-6 lg:px-16 flex justify-between items-center text-[11px] font-bold border-b border-blue-500/20">
        <div className="flex gap-10 items-center">
          <div className="flex items-center gap-2 text-blue-400 group cursor-pointer">
            <FaBolt className="text-orange-500 group-hover:scale-125 transition-transform" />
            <span className="uppercase tracking-tighter">
              Enjoy Flash 60% Sale
            </span>
          </div>
        </div>
        <div className="flex gap-8 items-center opacity-90 uppercase">
          <span
            className="hover:text-blue-400 cursor-pointer"
            onClick={() => navigate("/MerkovaSellerCentral")}
          >
            Become A Seller On Merkova
          </span>
            <span className="text-xs uppercase" onClick={handlelogout}>
              LogOut
            </span>
          <div className="flex items-center gap-1 cursor-pointer bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/30">
            <FaGlobe className="text-blue-400" /> EN / BDT
            
          </div>
        </div>
      </div>

      {/* TIER 2: IDENTITY & SEARCH */}
      <div
        className={`px-6 lg:px-16 py-4 flex items-center gap-12 transition-all duration-500 ${
          isScrolled ? "bg-[#0f172a]/95 backdrop-blur-xl py-2" : "bg-[#0f172a]"
        }`}
      >
        <div className="flex items-center cursor-pointer group shrink-0">
          <div className="relative">
            <h1 className="text-4xl font-black text-white tracking-tighter italic group-hover:text-blue-500 transition-all duration-300">
              MERKOVA
            </h1>
            <span className="absolute -top-1 -right-4 text-[10px] bg-blue-600 text-white px-1.5 rounded-sm font-black italic">
              Bangladdesh
            </span>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="flex bg-white rounded-full overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)] focus-within:ring-4 ring-blue-500/40 transition-all">
            <input
              type="text"
              placeholder="Search the Merkova universe..."
              className="w-full px-8 py-3 text-slate-800 outline-none font-semibold text-sm"
            />
            <button className="bg-blue-700 hover:bg-blue-600 px-10 text-white transition-all">
              <FaSearch className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-10 text-white font-bold">
          <div className="flex flex-col items-center cursor-pointer group">
            <FaUserAlt className="text-2xl group-hover:text-blue-400" />
            <span className="text-[10px] mt-1 opacity-70">Account</span>
          
          </div>
          <div className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full transition-all shadow-xl active:scale-95 cursor-pointer">
            <div className="relative">
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-orange-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                0
              </span>
            </div>
            <span className="text-xs uppercase">Cart</span>
             
          </div>
        </div>
      </div>

      {/* TIER 3: MEGA MENU TRIGGER */}
      <div
        className="bg-[#1e293b] text-white px-6 lg:px-16 py-2 flex items-center gap-8 text-[12px] font-black relative border-t border-white/5"
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        <div
          className={`flex items-center gap-3 cursor-pointer py-1 px-4 rounded-md transition-all ${
            isMenuOpen ? "bg-blue-700" : "hover:bg-white/10"
          }`}
          onMouseEnter={() => setIsMenuOpen(true)}
        >
          <div className="flex flex-col gap-1 w-4">
            <span className="h-0.5 w-full bg-white"></span>
            <span className="h-0.5 w-full bg-white"></span>
          </div>
          <span className="uppercase tracking-wider">All Departments</span>
        </div>

        {/* MEGA MENU ENGINE */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 w-full bg-white shadow-2xl flex max-h-[80vh] overflow-hidden text-slate-900 border-b border-slate-200"
              onMouseEnter={() => setIsMenuOpen(true)}
            >
              {/* SIDEBAR */}
              <div className="w-72 bg-slate-50 border-r border-slate-200 overflow-y-auto">
                {MERKOVA_DATA.map((cat) => (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setActiveCategory(cat)}
                    className={`px-8 py-4 flex justify-between items-center cursor-pointer transition-all ${
                      activeCategory.id === cat.id
                        ? "bg-white text-blue-600 border-l-4 border-blue-600 shadow-sm"
                        : "hover:bg-slate-100 opacity-70"
                    }`}
                  >
                    <span className="text-[13px] uppercase font-black tracking-tighter">
                      {cat.name}
                    </span>
                    <FaChevronRight className="text-[10px]" />
                  </div>
                ))}
              </div>

              {/* DYNAMIC CONTENT GRID */}
              <div className="flex-1 p-10 overflow-y-auto bg-white">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                  <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tighter">
                    Merkova{" "}
                    <span className="text-blue-600">{activeCategory.name}</span>
                  </h2>
                  {activeCategory.featured && (
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black animate-bounce">
                      {activeCategory.featured.discount}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-10">
                  {activeCategory.groups.map((group, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-l-2 border-blue-500 pl-2">
                        {group.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {group.items.map((item, iIdx) => (
                          <motion.div
                            key={iIdx}
                            whileHover={{ y: -5 }}
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                          >
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:border-blue-500 transition-all shadow-sm">
                              <img
                                src={item.img}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                              {item.hot && (
                                <div className="absolute top-1 right-1 bg-red-600 text-white text-[7px] px-1 rounded-sm">
                                  <FaFire />
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] font-bold text-center text-slate-600 group-hover:text-blue-600 uppercase transition-colors">
                              {item.name}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default MerkovaNavbar;
