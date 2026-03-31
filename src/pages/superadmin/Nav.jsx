import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Store,
  Users,
  UserCheck,
  Image,
  Layers,
  Megaphone,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { serverurl } from "../../App";
import { clearuser } from "../redux/User";

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setopen] = useState(true);
  const [ismobile, setismobile] = useState(false);

  const { userData } = useSelector((state) => state.user);

  const adminname = userData?.name || "Super Admin";
  const adminemail = userData?.email || "admin@merkova.com";
  const adminavatar = userData?.avatar?.path || "/avatar.png";

  /* ================= RESPONSIVE ================= */
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

  /* ================= LOGOUT ================= */
  const handlelogout = async () => {
    try {
      const res = await axios.post(
        `${serverurl}/user/signout`,
        {},
        { withCredentials: true }
      );
      if (res?.data?.success) {
        toast.success("SuperAdmin logout successful");
        dispatch(clearuser());
        navigate("/signin");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navitems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Seller Approval", path: "/sellerapproval", icon: UserCheck },
    { name: "All Sellers", path: "/allsellers", icon: Store },
    { name: "Shop Creating", path: "/creator", icon: Store },

    { name: "All Users", path: "/allusers", icon: Users },
    { name: "Seller Signup", path: "/sellersignup", icon: UserCheck },
    { name: "Home Banner", path: "/homebanner", icon: Image },
    { name: "Seller Home Banner", path: "/sellerhomebanner", icon: Image },
    { name: "Navigation Control", path: "/navcus", icon: Layers },
    { name: "Campaigns", path: "/campaign", icon: Megaphone },
    { name: "All Products", path: "/allproducts", icon: ShoppingBag },
    { name: "Revenue Analytics", path: "/revenue", icon: BarChart3 },
    { name: "Category Creator", path: "/categorycreator", icon: Megaphone },
    { name: "Profile Settings", path: "/sellerprofile", icon: Settings },
  ];

  return (
    <>
      {/* TOGGLE */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setopen(!open)}
        animate={{ left: open ? "19rem" : "0.75rem" }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="fixed top-4 z-[100] p-3 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 text-white shadow-2xl cursor-pointer"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {ismobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                exit={{ opacity: 0 }}
                onClick={() => setopen(false)}
                className="fixed inset-0 bg-black z-30"
              />
            )}

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 z-40 h-screen w-[20rem] bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            >
              {/* PROFILE */}
              <div className="p-6 flex items-center gap-4 border-b border-blue-800">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 via-cyan-300 to-purple-500 p-[2px]"
                >
                  <img
                    src={adminavatar}
                    className="w-full h-full rounded-full object-cover bg-blue-950"
                  />
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-950" />
                </motion.div>
                <div className="truncate">
                  <h2 className="font-semibold truncate">{adminname}</h2>
                  <p className="text-xs text-blue-300 truncate">{adminemail}</p>
                  <p className="text-[10px] text-blue-400">
                    Merkova SuperAdmin
                  </p>
                </div>
              </div>

              {/* SEARCH */}
              <div className="px-5 py-4">
                <div className="flex items-center bg-blue-800/40 rounded-xl px-3 py-2">
                  <Search size={16} />
                  <input
                    className="bg-transparent outline-none text-sm px-2 w-full"
                    placeholder="Search modules"
                  />
                </div>
              </div>

              {/* NAV */}
              <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navitems.map((item) => (
                  <NavLink key={item.name} to={item.path}>
                    {({ isActive }) => (
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition cursor-pointer ${
                          isActive
                            ? "bg-white text-blue-900 shadow-xl"
                            : "hover:bg-blue-700/50"
                        }`}
                      >
                        <item.icon size={20} />
                        <span className="text-sm">{item.name}</span>
                      </motion.div>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* LOGOUT */}
              <div className="p-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlelogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700"
                >
                  <LogOut size={18} /> Logout
                </motion.button>
              </div>

              <div className="text-center text-[10px] text-blue-400 pb-3">
                © {new Date().getFullYear()} Merkova SuperAdmin Panel
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
