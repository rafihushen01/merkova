import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import axios from "axios";
import { serverurl } from "../../App.jsx";
import {
  FaTrash,
  FaEdit,
  FaArrowsAlt,
  FaPlus,
  FaLink,
} from "react-icons/fa";

/* ================= BACKGROUND ================= */
const MerkovaBackground = () => (
  <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-black" />

    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[20%] -left-[10%] w-[45%] h-[45%] bg-blue-600/20 blur-[160px] rounded-full"
    />

    <motion.div
      animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.4, 0.15] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[55%] bg-cyan-500/10 blur-[180px] rounded-full"
    />
  </div>
);

/* ================= BANNER CARD ================= */
const BannerCard = ({ banner, onEdit, onDelete, onReorder }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(useSpring(y), [-40, 40], ["8deg", "-8deg"]);
  const rotateY = useTransform(useSpring(x), [-40, 40], ["-8deg", "8deg"]);

  const images = [...banner.images].sort(
    (a, b) => a.position - b.position
  );

  const handleReorder = (from, to) => {
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);

    onReorder({
      ...banner,
      images: updated.map((img, i) => ({
        ...img,
        position: i,
      })),
    });
  };

  return (
    <motion.div
      style={{ rotateX, rotateY }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group relative rounded-3xl bg-gradient-to-b from-blue-500/30 to-transparent p-[1px]"
    >
      <div className="rounded-3xl overflow-hidden bg-slate-900/80 backdrop-blur-xl">
        {/* IMAGE */}
        <div className="relative h-64">
          <motion.img
            src={images[0]?.url}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* THUMBNAILS */}
          <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 bg-gradient-to-t from-black/90">
            {images.map((img, index) => (
              <img
                key={img._id}
                src={img.url}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("index", index)
                }
                onDrop={(e) => {
                  e.preventDefault();
                  handleReorder(
                    Number(e.dataTransfer.getData("index")),
                    index
                  );
                }}
                onDragOver={(e) => e.preventDefault()}
                className="h-14 w-14 rounded-xl border border-blue-500/40 object-cover cursor-grab active:cursor-grabbing"
              />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 break-all">
            <FaLink className="text-blue-400" />
            {banner.navigationlink}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(banner)}
                className="p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 cursor-pointer"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => onDelete(banner._id)}
                className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-400 cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>

            <div className="text-xs flex items-center gap-2 text-slate-500">
              <FaArrowsAlt /> Drag & reorder
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ================= MAIN PAGE ================= */
const Homebanner = () => {
  const [banners, setbanners] = useState([]);
  const [selected, setselected] = useState(null);
  const [files, setfiles] = useState([]);
  const [preview, setpreview] = useState([]);
  const [navigationlink, setnavigationlink] = useState("/mega-sale");
  const [loading, setloading] = useState(false);

  const fetchbanners = async () => {
    const res = await axios.get(`${serverurl}/homebanner`);
    setbanners(res.data || []);
  };

  useEffect(() => {
    fetchbanners();
  }, []);

  const submit = async () => {
    if (!files.length) return;

    setloading(true);
    const fd = new FormData();

    files.forEach((f) => fd.append("images", f));
    if (!selected) fd.append("navigationlink", navigationlink);

    if (selected) {
      await axios.put(
        `${serverurl}/homebanner/add-images/${selected._id}`,
        fd
      );
    } else {
      await axios.post(`${serverurl}/homebanner/create`, fd);
    }

    setfiles([]);
    setpreview([]);
    setnavigationlink("");
    setselected(null);
    fetchbanners();
    setloading(false);
  };

  return (
    <div className="min-h-screen text-slate-200">
      <MerkovaBackground />

      <main className="relative z-10 max-w-[1700px] mx-auto p-10">
        <h1 className="text-5xl font-black italic mb-12">
          MERKOVA <span className="text-blue-500">HOME BANNERS</span>
        </h1>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* FORM */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-blue-500/30 bg-slate-900/70 p-8 space-y-6">
              {!selected && (
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Navigation Link
                  </label>
                  <input
                    value={navigationlink}
                    onChange={(e) => setnavigationlink(e.target.value)}
                    placeholder="/campaign/sale"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-blue-500/30 outline-none"
                  />
                </div>
              )}

              <label className="flex flex-col items-center justify-center gap-4 cursor-pointer border-2 border-dashed border-blue-500/40 rounded-2xl p-8">
                <FaPlus className="text-3xl text-blue-400" />
                <span className="text-sm text-slate-400">
                  Upload banner images
                </span>
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={(e) => {
                    const f = Array.from(e.target.files);
                    setfiles(f);
                    setpreview(f.map((x) => URL.createObjectURL(x)));
                  }}
                />
              </label>

              {preview.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {preview.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      className="h-24 w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}

              <button
                disabled={loading}
                onClick={submit}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold cursor-pointer"
              >
                {loading
                  ? "Processing..."
                  : selected
                  ? "Add Images"
                  : "Create Banner"}
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="lg:col-span-8 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {banners.map((banner) => (
                <BannerCard
                  key={banner._id}
                  banner={banner}
                  onEdit={(b) => setselected(b)}
                  onDelete={async (id) => {
                    await axios.delete(`${serverurl}/homebanner/${id}`);
                    fetchbanners();
                  }}
                  onReorder={async (data) => {
                    await axios.put(
                      `${serverurl}/homebanner/reorder/${data._id}`,
                      {
                        order: data.images.map((img) => ({
                          imageid: img._id,
                          position: img.position,
                        })),
                      }
                    );
                    fetchbanners();
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homebanner;
