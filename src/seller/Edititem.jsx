import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { serverurl } from "../App.jsx";
import { Plus, Trash2, Loader2, Save, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";

const Edititem = () => {
  const { itemid } = useParams();
  const navigate = useNavigate();
  const { shopData } = useSelector((s) => s.shop);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadfiles, setUploadfiles] = useState({});

  // ================= FETCH ITEM =================
  const fetchItem = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${serverurl}/item/myshop`,
        { shopid: shopData._id },
        { withCredentials: true }
      );
      const found = res.data.items.find((i) => i._id === itemid);
      if (found) setItem(found);
    } catch {
      toast.error("Failed to load item");
    } finally {
      setLoading(false);
    }
  }, [itemid, shopData?._id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  // ================= GLOBAL CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((p) => ({ ...p, [name]: value }));
  };

  // ================= COLOR VARIANT =================
  const updateColor = (colorname, key, value) => {
    setItem((p) => ({
      ...p,
      colorvariants: p.colorvariants.map((c) =>
        c.colorname === colorname ? { ...c, [key]: value } : c
      ),
    }));
  };

  const pickFiles = (colorname, type, files, mode = "append", index = null) => {
    setUploadfiles((p) => ({
      ...p,
      [`${type}_${colorname}_${index !== null ? index : "all"}`]: {
        files: Array.from(files),
        mode,
        index,
      },
    }));

    // Preview in UI
    if (type === "images") {
      const images = [...item.colorvariants.find((c) => c.colorname === colorname).images];
      if (mode === "replace" && index !== null) {
        images[index] = { url: URL.createObjectURL(files[0]) };
      } else {
        images.push(...Array.from(files).map((f) => ({ url: URL.createObjectURL(f) })));
      }
      updateColor(colorname, "images", images);
    }

    if (type === "video") {
      updateColor(colorname, "videos", [{ url: URL.createObjectURL(files[0]) }]);
    }
  };

  // ================= SIZE =================
  const addSize = (colorname) => {
    const current = item.colorvariants.find((c) => c.colorname === colorname)?.sizes || [];
    updateColor(colorname, "sizes", [...current, { label: "", price: 0, quantity: 0, sku: "" }]);
  };

  const updateSize = (colorname, i, k, v) => {
    const sizes = [...item.colorvariants.find((c) => c.colorname === colorname).sizes];
    sizes[i][k] = v;
    updateColor(colorname, "sizes", sizes);
  };

  const removeSize = (colorname, i) => {
    const sizes = [...item.colorvariants.find((c) => c.colorname === colorname).sizes];
    sizes.splice(i, 1);
    updateColor(colorname, "sizes", sizes);
  };

  // ================= SAVE =================
  const saveItem = async () => {
    try {
      setLoading(true);
      const fd = new FormData();

      // ---- GLOBAL FIELDS ----
      const fields = [
        "title","description","brand","model","sku","barcode","age","sex","material",
        "season","style","weight","currency","stockstatus","brandorigin",
        "countryoforigin","edition","modelnumber","serialnumber","genderfit",
        "tags_text","slug","keywords","baseprice","discountpercent","isactive"
      ];

      fields.forEach((f) => {
        let value = item[f];
        if (Array.isArray(value) || typeof value === "object") value = JSON.stringify(value);
        fd.append(f, value);
      });

      // ---- COLOR VARIANTS ----
      item.colorvariants.forEach((c) => {
        fd.append("colorname", c.colorname);
        fd.append("sizes", JSON.stringify(c.sizes || []));
        fd.append("images", JSON.stringify(c.images || []));
        fd.append("videos", JSON.stringify(c.videos || []));
      });

      // ---- FILES ----
      Object.entries(uploadfiles).forEach(([k, v]) => {
        fd.append("colormode", v.mode);
        v.files.forEach((f) => fd.append(k, f));
      });

      const res = await axios.patch(`${serverurl}/item/edit/${itemid}`, fd, { withCredentials: true });

      if (res.data.success) {
        toast.success("Product updated successfully");
        fetchItem();
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteItem = async () => {
    if (!confirm("Delete product permanently?")) return;
    try {
      const res = await axios.delete(`${serverurl}/item/delete/${itemid}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Product deleted");
        navigate("/seller/all-items");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!item || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-black text-white p-8">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>
        <h1 className="text-4xl font-bold">Edit Item — {item.title}</h1>
      </div>

      {/* CORE INFO */}
      <section className="grid md:grid-cols-2 gap-4 mb-10">
        {[
          "title","brand","model","sku","barcode","age","sex","material",
          "season","style","weight","currency","stockstatus","brandorigin",
          "countryoforigin","edition","modelnumber","serialnumber","genderfit",
          "tags_text","slug"
        ].map((f) => (
          <input
            key={f}
            name={f}
            value={item[f] || ""}
            onChange={handleChange}
            placeholder={f}
            className="p-3 rounded-xl bg-white/10 border border-white/20"
          />
        ))}
        <textarea
          name="description"
          value={item.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="md:col-span-2 p-3 rounded-xl bg-white/10 border border-white/20"
        />
        <input
          name="keywords"
          value={item.keywords?.join(", ") || ""}
          onChange={(e) => setItem((p) => ({ ...p, keywords: e.target.value.split(",") }))}
          placeholder="Keywords (comma separated)"
          className="md:col-span-2 p-3 rounded-xl bg-white/10 border border-white/20"
        />
        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={item.isactive}
            onChange={(e) => setItem((p) => ({ ...p, isactive: e.target.checked }))}
          /> Active
        </label>
      </section>

      {/* PRICING */}
      <section className="grid md:grid-cols-4 gap-4 mb-10">
        {["baseprice","discountpercent","discountprice","currentprice"].map((f) => (
          <input
            key={f}
            name={f}
            value={item[f] || 0}
            readOnly={["discountprice","currentprice"].includes(f)}
            onChange={handleChange}
            placeholder={f}
            className="p-3 rounded-xl bg-white/10 border border-white/20"
          />
        ))}
      </section>

      {/* COLOR VARIANTS */}
      <div className="space-y-8">
        {item.colorvariants.map((c) => (
          <motion.div key={c.colorname} className="bg-white/10 p-6 rounded-2xl border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">{c.colorname}</h2>

            {/* IMAGES */}
            <div className="mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-3">
                {c.images?.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img.url}
                      className="w-full aspect-square object-cover rounded-xl border border-white/20 cursor-pointer"
                      onClick={() => document.getElementById(`replace-${c.colorname}-${i}`).click()}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition">
                      <span className="text-sm font-semibold">Replace</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      id={`replace-${c.colorname}-${i}`}
                      onChange={(e) => pickFiles(c.colorname, "images", e.target.files, "replace", i)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <input type="file" multiple onChange={(e)=>pickFiles(c.colorname,"images",e.target.files,"append")} />
              </div>
            </div>

            {/* VIDEO */}
            <div className="mb-4">
              {c.videos?.[0] && (
                <video src={c.videos[0].url} controls className="w-full max-w-lg rounded-xl mb-2" />
              )}
              <input
                type="file"
                accept="video/*"
                onChange={(e)=>pickFiles(c.colorname,"video",e.target.files,"replace")}
              />
            </div>

            {/* SIZES */}
            <div>
              {c.sizes?.map((s, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 mb-2">
                  {["label","price","quantity","sku"].map((k) => (
                    <input
                      key={k}
                      value={s[k]}
                      onChange={(e)=>updateSize(c.colorname,i,k,e.target.value)}
                      className="p-2 bg-white/10 rounded"
                    />
                  ))}
                  <button onClick={()=>removeSize(c.colorname,i)}>
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              ))}
              <button onClick={()=>addSize(c.colorname)} className="text-blue-400 flex gap-2">
                <Plus size={16}/> Add Size
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-6 mt-12">
        <button onClick={saveItem} className="px-8 py-3 bg-green-600 rounded-2xl flex gap-2">
          <Save /> Save Changes
        </button>
        <button onClick={deleteItem} className="px-8 py-3 bg-red-600 rounded-2xl">
          Delete Item
        </button>
      </div>
    </div>
  );
};

export default Edititem;
