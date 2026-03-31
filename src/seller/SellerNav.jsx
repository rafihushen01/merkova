// ================= MERKOVA TRILLION-DOLLAR SELLER NAVBAR =================
// Ultra-Premium | Scalable | Pin-Based | Sectioned | Growth-Focused
// Enterprise-Safe | Null-Proof | Production-Grade

import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  Pin,
  GraduationCap,
  Palette,
  Megaphone
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { serverurl } from "../App";
import { clearuser } from "../pages/redux/User";

// ================= PIN STORAGE =================
const getpinned = () => JSON.parse(localStorage.getItem("seller_pins") || "[]");
const setpinned = (data) =>
  localStorage.setItem("seller_pins", JSON.stringify(data));

const SellerNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);
  const { shopData } = useSelector((state) => state.shop);

  const [open, setopen] = useState(true);
  const [ismobile, setismobile] = useState(false);
  const [pinned, setPinned] = useState(getpinned());

  const sellername = userData?.name || "Seller";
  const selleremail = userData?.email || "";
  const selleravatar = userData?.avatar?.path || "/avatar.png";

  // ================= RESPONSIVE =================
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 1024) {
        setismobile(true);
        setopen(false);
      } else {
        setismobile(false);
        setopen(true);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ================= PIN TOGGLE =================
  const togglepin = (key) => {
    const updated = pinned.includes(key)
      ? pinned.filter((p) => p !== key)
      : [...pinned, key];
    setPinned(updated);
    setpinned(updated);
  };

  // ================= LOGOUT =================
  const handlelogout = async () => {
    try {
      const res = await axios.post(
        `${serverurl}/user/signout`,
        {},
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success("Seller Logout Successful");
        dispatch(clearuser());
        navigate("/signin");
      }
    } catch {
      toast.error("Logout failed");
    }
  };

  // ================= SHOP STATE LOGIC =================
  const shopnotready = !shopData || shopData?.isclaimed === false;

  // ================= NAV CONFIG =================
  const sections = useMemo(() => {
    return [
      { title: "Pinned", key: "pinned", items: [] },

      {
        title: "Business Overview",
        items: [
          { key: "dashboard", label: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
          { key: "orders", label: "Orders", path: "/seller/orders", icon: ShoppingCart },
          { key: "earnings", label: "Earnings", path: "/seller/earnings", icon: BarChart3 }
        ]
      },

      {
        title: "Products",
        items: [
          { key: "additem", label: "Add Product", path: "/createitem", icon: PlusCircle },
          { key: "items", label: "My Products", path: "/AllShopItems", icon: Package }
        ]
      },

      {
        title: "Store Growth",
        items: [
          { key: "decor", label: "Store Decor", path: "/seller/storedecor", icon: Palette },
          { key: "campaign", label: "Campaigns", path: "/seller/campaigns", icon: Megaphone }
        ]
      },

      {
        title: "Merkova University",
        items: [
          { key: "academy", label: "Seller Academy", path: "/seller/university", icon: GraduationCap }
        ]
      },

      {
        title: "Shop Management",
        items: shopnotready
          ? [
              { key: "createshop", label: "Create Shop Approval", path: "/sellershopapproval", icon: Store },
              { key: "claimshop", label: "Claim Shop", path: "/claimshop", icon: Store }
            ]
          : [
              { key: "editshop", label: "Edit Shop", path: "/editshop", icon: Store }
            ]
      },

      {
        title: "Account Settings",
        items: [
          { key: "profile", label: "Profile Settings", path: "/sellerprofile", icon: Settings }
        ]
      }
    ];
  }, [shopData]);

  // ================= PINNED MERGE =================
  sections[0].items = sections
    .flatMap((s) => s.items)
    .filter((i) => pinned.includes(i.key));

  return (
    <>
      {/* TOGGLE */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setopen(!open)}
        className={`fixed top-5 z-[100] p-3 rounded-xl 
        bg-gradient-to-br from-blue-900 to-blue-700 
        backdrop-blur-xl shadow-2xl text-white
        ${open ? "left-[22rem]" : "left-9"}`}
      >
        {open ? <X /> : <Menu />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed z-40 h-screen w-[22rem] 
            bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 
            text-white flex flex-col"
          >
            {/* PROFILE */}
            <div className="p-6 flex gap-4 border-b border-blue-800">
              <img src={selleravatar} className="w-14 h-14 rounded-full" />
              <div>
                <h2 className="font-semibold">{sellername}</h2>
                <p className="text-xs text-blue-300">{selleremail}</p>
              </div>
            </div>

            {/* NAV */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {sections.map(
                (section) =>
                  section.items.length > 0 && (
                    <div key={section.title}>
                      <p className="text-xs uppercase text-blue-400 mb-2">
                        {section.title}
                      </p>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <NavLink key={item.key} to={item.path}>
                            {({ isActive }) => (
                              <motion.div
                                whileHover={{ scale: 1.04 }}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer
                                ${
                                  isActive
                                    ? "bg-white text-blue-900"
                                    : "hover:bg-blue-700/40"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <item.icon size={18} />
                                  <span className="text-sm">{item.label}</span>
                                </div>
                                <Pin
                                  size={14}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    togglepin(item.key);
                                  }}
                                  className={
                                    pinned.includes(item.key)
                                      ? "text-yellow-400"
                                      : "text-blue-400"
                                  }
                                />
                              </motion.div>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>

            {/* LOGOUT */}
            <div className="p-4">
              <button
                onClick={handlelogout}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default SellerNav;
