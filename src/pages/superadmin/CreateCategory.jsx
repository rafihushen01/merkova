import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Power,
  Trash2,
  UploadCloud,
  Save,
  Loader2,
  Link as LinkIcon
} from "lucide-react";
import { serverurl } from "../../App.jsx";

const CreateCategory = () => {
  // ================= CORE =================
  const [categories, setcategories] = useState([]);
  const [loading, setloading] = useState(false);

  // ================= CREATE CATEGORY =================
  const [name, setname] = useState("");
  const [navigatelink, setnavigatelink] = useState("/category");
  const [serial, setserial] = useState(0);
  const [isactive, setisactive] = useState(true);
  const [image, setimage] = useState(null);
  const [preview, setpreview] = useState(null);

  // ================= MODAL =================
  const [activedraft, setactivedraft] = useState(null);

  // ================= FETCH =================
  const fetchcategories = async () => {
    try {
      const res = await axios.get(`${serverurl}/category/admin/all`);
      if (res.data.success) setcategories(res.data.categories);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchcategories();
  }, []);

  // ================= CREATE =================
  const createcategory = async () => {
    if (!name.trim()) return toast.error("Category name required");
    try {
      setloading(true);
      const fd = new FormData();
      fd.append("name", name);
      fd.append("navigatelink", navigatelink);
      fd.append("serial", serial);
      fd.append("isactive", isactive);
      if (image) fd.append("image", image);

      const res = await axios.post(`${serverurl}/category/create`, fd);
      if (res.data.success) {
        toast.success("Category created");
        setname("");
        setserial(0);
        setimage(null);
        setpreview(null);
        fetchcategories();
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Create failed");
    } finally {
      setloading(false);
    }
  };

  // ================= ACTIONS =================
  const togglecategory = async (id) => {
    await axios.patch(`${serverurl}/category/toggle/${id}`);
    fetchcategories();
  };

  const deletesub = async (cid, type, sid) => {
    await axios.delete(`${serverurl}/category/delete/${cid}/${type}/${sid}`);
    fetchcategories();
  };

  const openaddmodal = (cid, type) => {
    setactivedraft({
      cid,
      type,
      name: "",
      navigatelink: "",
      image: null,
      preview: null,
      isactive: true
    });
  };

  const submitdraft = async () => {
    const { cid, type, name, navigatelink, image, isactive } = activedraft;
    if (!name.trim()) return toast.error("Name required");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("navigatelink", navigatelink);
    fd.append("isactive", isactive);
    if (image) fd.append("image", image);

    const url =
      type === "subcategory"
        ? `/category/add-subcategory/${cid}`
        : type === "brand"
        ? `/category/add-brand/${cid}`
        : `/category/add-material/${cid}`;

    await axios.post(serverurl + url, fd);
    toast.success(`${type} added`);
    setactivedraft(null);
    fetchcategories();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-indigo-950 to-black p-8">
      <Toaster />

      {/* ================= FULL PAGE GRID ================= */}
      <div className="w-full grid grid-cols-1 2xl:grid-cols-6 gap-8">

        {/* ================= LEFT PANEL ================= */}
        <div className="2xl:col-span-1 bg-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl">
          <h2 className="text-white text-xl font-bold mb-6">
            Create Category
          </h2>

          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Category name"
            className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 text-white"
          />

          <input
            value={navigatelink}
            onChange={(e) => setnavigatelink(e.target.value)}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 text-white"
          />

          <input
            type="number"
            value={serial}
            onChange={(e) => setserial(e.target.value)}
            className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 text-white"
          />

          <label className="flex gap-2 text-white mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isactive}
              onChange={() => setisactive(!isactive)}
            />
            Active
          </label>

          <label className="border border-dashed border-purple-400/40 rounded-xl p-4 text-center text-white cursor-pointer">
            <input
              type="file"
              hidden
              onChange={(e) => {
                setimage(e.target.files[0]);
                setpreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <UploadCloud className="inline mr-2" />
            Upload Image
          </label>

          {preview && (
            <img
              src={preview}
              className="mt-4 rounded-xl h-40 w-full object-cover"
            />
          )}

          <button
            onClick={createcategory}
            disabled={loading}
            className="mt-5 w-full flex justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            Create Category
          </button>
        </div>

        {/* ================= CATEGORY AREA ================= */}
        <div className="2xl:col-span-5 space-y-8">
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4 items-center">
                  {cat.image && (
                    <img
                      src={cat.image}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-white text-xl font-bold">
                      {cat.name}
                    </h3>
                    <p className="text-purple-300 text-sm flex gap-1">
                      <LinkIcon size={14} />
                      {cat.navigatelink}
                    </p>
                  </div>
                </div>

                <Power
                  onClick={() => togglecategory(cat._id)}
                  className={`cursor-pointer ${
                    cat.isactive ? "text-green-400" : "text-red-500"
                  }`}
                />
              </div>

              {/* SUB / BRAND / MATERIAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["subcategory", "brand", "material"].map((t) => (
                  <div key={t} className="bg-black/30 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-purple-200 font-bold uppercase">
                        {t}
                      </p>
                      <Plus
                        onClick={() => openaddmodal(cat._id, t)}
                        className="text-green-400 cursor-pointer"
                      />
                    </div>

                    {(cat[t + "s"] || []).map((i) => (
                      <motion.div
                        key={i._id}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/10 rounded-xl p-4 mb-4 flex justify-between items-center"
                      >
                        <div className="flex gap-3 items-center">
                          {i.image && (
                            <img
                              src={i.image}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          )}
                          <div>
                            <p className="text-white font-semibold">
                              {i.name}
                            </p>
                            {i.navigatelink && (
                              <p className="text-purple-300 text-xs flex gap-1">
                                <LinkIcon size={12} />
                                {i.navigatelink}
                              </p>
                            )}
                          </div>
                        </div>

                        <Trash2
                          size={16}
                          onClick={() =>
                            deletesub(cat._id, t, i._id)
                          }
                          className="text-red-400 cursor-pointer"
                        />
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {activedraft && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-lg">
              <h3 className="text-white text-xl font-bold mb-4">
                Add {activedraft.type}
              </h3>

              <input
                placeholder="Name"
                className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 text-white"
                onChange={(e) =>
                  setactivedraft({ ...activedraft, name: e.target.value })
                }
              />

              <input
                placeholder="Navigation link"
                className="w-full mb-3 px-4 py-3 rounded-xl bg-black/40 text-white"
                onChange={(e) =>
                  setactivedraft({
                    ...activedraft,
                    navigatelink: e.target.value
                  })
                }
              />

              <label className="border border-dashed rounded-xl p-4 text-center text-white cursor-pointer mb-3">
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setactivedraft({
                      ...activedraft,
                      image: e.target.files[0],
                      preview: URL.createObjectURL(e.target.files[0])
                    })
                  }
                />
                <UploadCloud className="inline mr-2" />
                Upload Image
              </label>

              {activedraft.preview && (
                <img
                  src={activedraft.preview}
                  className="h-32 w-full object-cover rounded-xl mb-3"
                />
              )}

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setactivedraft(null)}
                  className="text-white/60"
                >
                  Cancel
                </button>
                <button
                  onClick={submitdraft}
                  className="bg-purple-700 px-6 py-2 rounded-xl text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateCategory;
