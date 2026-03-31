import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { serverurl } from "../../App.jsx";

const particles = Array.from({ length: 24 });

const Navcus = () => {
  const [loading, setloading] = useState(false);
  const [theme, settheme] = useState({
    background: "#020617",
    text: "#ffffff",
    hover: "#7c3aed",
  });
  const [categories, setcategories] = useState([]);

  /* ================= IMAGE UPLOAD ================= */
  const uploadimage = async (file, cb) => {
    if (!file) return;
    const toastid = toast.loading("Uploading image...");
    try {
      const formdata = new FormData();
      formdata.append("image", file);
      const res = await axios.post(`${serverurl}/nav/admin/upload-image`, formdata, { withCredentials: true });
      toast.success("Uploaded", { id: toastid });
      cb(res.data.image);
    } catch {
      toast.error("Upload failed", { id: toastid });
    }
  };

  /* ================= ADDERS ================= */
  const addcategory = () => {
    setcategories([...categories, {
      title: "",
      image: "",
      extra: { badge: "" },
      subcategories: []
    }]);
    toast.success("Main category added");
  };

  const addsubcategory = (i) => {
    const copy = [...categories];
    copy[i].subcategories.push({
      title: "",
      image: "",
      extra: { discount: "" },
      types: []
    });
    setcategories(copy);
    toast.success("Subcategory added");
  };

  const addtype = (i, j) => {
    const copy = [...categories];
    copy[i].subcategories[j].types.push({
      title: "",
      image: "",
      badge: "",
      extra: {}
    });
    setcategories(copy);
    toast.success("Type added");
  };

  /* ================= SAVE ================= */
  const savenavbar = async () => {
    if (categories.length === 0) return toast.error("Add at least one category!");
    setloading(true);
    const toastid = toast.loading("Saving navbar...");
    try {
      await axios.post(`${serverurl}/nav/admin/save`, { theme, categories }, { withCredentials: true });
      toast.success("Navbar saved 🚀", { id: toastid });
    } catch {
      toast.error("Save failed", { id: toastid });
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] px-6 py-16">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-600 blur-xl opacity-20"
          initial={{ x: Math.random() * 1600, y: Math.random() * 900, scale: Math.random() * 0.6 + 0.4 }}
          animate={{ y: [0, -200, 0], opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: Math.random() * 12 + 10, repeat: Infinity, ease: "linear" }}
          style={{ width: Math.random() * 120 + 60, height: Math.random() * 120 + 60 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-7xl mx-auto bg-white/10 backdrop-blur-3xl border border-white/15 rounded-[40px] p-12 shadow-2xl"
      >
        <h1 className="text-5xl font-black text-white mb-14">
          Merkova Navbar Builder
          <span className="block text-xs tracking-[0.4em] mt-4 text-purple-300 uppercase">Super Admin Control Panel</span>
        </h1>

        {/* THEME PICKER */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {Object.keys(theme).map((key) => (
            <div key={key} className="bg-black/40 p-6 rounded-2xl">
              <p className="text-xs text-purple-300 uppercase mb-3">{key}</p>
              <input
                type="color"
                value={theme[key]}
                onChange={(e) => settheme({ ...theme, [key]: e.target.value })}
                className="w-full h-14 rounded-xl cursor-pointer"
              />
            </div>
          ))}
        </div>

        <button onClick={addcategory} className="mb-10 px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl font-black cursor-pointer">
          + Add Main Category
        </button>

        <AnimatePresence>
          {categories.map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="bg-black/40 rounded-3xl p-8 mb-14">
              <input
                placeholder="Main category title"
                value={cat.title}
                onChange={(e) => { const c = [...categories]; c[i].title = e.target.value; setcategories(c); }}
                className="w-full mb-3 p-3 rounded-xl bg-black/60 text-white"
              />

              <input type="file" onChange={(e) => uploadimage(e.target.files[0], (url) => { const c = [...categories]; c[i].image = url; setcategories(c); })} />

              <button onClick={() => addsubcategory(i)} className="mt-4 text-purple-300 cursor-pointer">+ Add Sub Category</button>

              {cat.subcategories.map((sub, j) => (
                <div key={j} className="ml-6 mt-6 border-l border-purple-500 pl-4">
                  <input placeholder="Sub category title" value={sub.title} onChange={(e) => { const c = [...categories]; c[i].subcategories[j].title = e.target.value; setcategories(c); }} className="w-full mb-2 p-3 rounded-xl bg-black/60 text-white" />

                  <input type="file" onChange={(e) => uploadimage(e.target.files[0], (url) => { const c = [...categories]; c[i].subcategories[j].image = url; setcategories(c); })} />

                  <button onClick={() => addtype(i, j)} className="mt-3 text-fuchsia-300 cursor-pointer">+ Add Type</button>

                  {sub.types.map((t, k) => (
                    <div key={k} className="ml-6 mt-4">
                      <input placeholder="Type title" value={t.title} onChange={(e) => { const c = [...categories]; c[i].subcategories[j].types[k].title = e.target.value; setcategories(c); }} className="w-full mb-2 p-3 rounded-xl bg-black/60 text-white" />

                      <input placeholder="Badge / Discount" value={t.badge} onChange={(e) => { const c = [...categories]; c[i].subcategories[j].types[k].badge = e.target.value; setcategories(c); }} className="w-full mb-2 p-3 rounded-xl bg-black/60 text-white" />

                      <input type="file" onChange={(e) => uploadimage(e.target.files[0], (url) => { const c = [...categories]; c[i].subcategories[j].types[k].image = url; setcategories(c); })} />
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>

        <button disabled={loading} onClick={savenavbar} className="w-full mt-20 py-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-2xl font-black rounded-3xl cursor-pointer">
          {loading ? "Saving..." : "Save Navbar"}
        </button>
      </motion.div>
    </div>
  );
};

export default Navcus;
