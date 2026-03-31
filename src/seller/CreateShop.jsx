import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Trash2, UploadCloud } from "lucide-react";
import { serverurl } from "../App.jsx";

const CreateItem = ({ shopid }) => {
  const [loading, setLoading] = useState(false);

  const [basic, setBasic] = useState({
    title: "",
    description: "",
    tags: "",
    brand: "",
    model: "",
    specification: "",
    warranty: "",
    availableoffers: "",
    baseprice: "",
    discountpercent: ""
  });

  const [variants, setVariants] = useState([
    {
      colorname: "",
      colorhex: "#000000",
      sizes: [{ label: "", price: "", quantity: "", sku: "" }],
      images: [],
      video: null
    }
  ]);

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        colorname: "",
        colorhex: "#000000",
        sizes: [{ label: "", price: "", quantity: "", sku: "" }],
        images: [],
        video: null
      }
    ]);
  };

  const removeVariant = index => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addSize = vindex => {
    const updated = [...variants];
    updated[vindex].sizes.push({ label: "", price: "", quantity: "", sku: "" });
    setVariants(updated);
  };

  const submitItem = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();

      Object.entries(basic).forEach(([key, val]) => {
        formdata.append(key, val);
      });

      formdata.append("shopid", shopid);

      const colorpayload = variants.map(v => ({
        colorname: v.colorname,
        colorhex: v.colorhex,
        sizes: v.sizes
      }));

      formdata.append("colorvariants", JSON.stringify(colorpayload));

      variants.forEach(v => {
        v.images.forEach(file => {
          formdata.append(`images_${v.colorname}`, file);
        });
        if (v.video) {
          formdata.append(`video_${v.colorname}`, v.video);
        }
      });

      await axios.post(`${serverurl}/item/create`, formdata, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Item created successfully");
      setVariants([variants[0]]);
    } catch (err) {
      toast.error("Item creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2c] to-black p-6">
      <Toaster />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl p-8"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Create Product (Merkova Seller)</h1>

        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-4">
          {Object.keys(basic).map(key => (
            <input
              key={key}
              placeholder={key}
              className="p-3 rounded-xl bg-black/40 text-white"
              value={basic[key]}
              onChange={e => setBasic({ ...basic, [key]: e.target.value })}
            />
          ))}
        </div>

        {/* COLOR VARIANTS */}
        <div className="mt-8 space-y-10">
          {variants.map((v, i) => (
            <div key={i} className="border border-white/10 p-6 rounded-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-white">Color Variant {i + 1}</h2>
                {variants.length > 1 && (
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeVariant(i)}
                  />
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <input
                  placeholder="Color Name (pink, black)"
                  className="p-3 rounded-xl bg-black/40 text-white"
                  value={v.colorname}
                  onChange={e => {
                    const u = [...variants];
                    u[i].colorname = e.target.value;
                    setVariants(u);
                  }}
                />
                <input
                  type="color"
                  value={v.colorhex}
                  onChange={e => {
                    const u = [...variants];
                    u[i].colorhex = e.target.value;
                    setVariants(u);
                  }}
                />
              </div>

              {/* IMAGES */}
              <div className="mt-4">
                <label className="text-white">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={e => {
                    const u = [...variants];
                    u[i].images = Array.from(e.target.files);
                    setVariants(u);
                  }}
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {v.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>

              {/* VIDEO */}
              <div className="mt-4">
                <label className="text-white">Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={e => {
                    const u = [...variants];
                    u[i].video = e.target.files[0];
                    setVariants(u);
                  }}
                />
                {v.video && (
                  <video
                    src={URL.createObjectURL(v.video)}
                    controls
                    className="mt-2 w-60 rounded-xl"
                  />
                )}
              </div>

              {/* SIZES */}
              <div className="mt-6">
                <h3 className="text-white mb-2">Sizes</h3>
                {v.sizes.map((s, si) => (
                  <div key={si} className="grid md:grid-cols-4 gap-2 mb-2">
                    <input placeholder="Label" value={s.label} className="p-2 bg-black/40 text-white"
                      onChange={e => {
                        const u = [...variants];
                        u[i].sizes[si].label = e.target.value;
                        setVariants(u);
                      }} />
                    <input placeholder="Price" value={s.price} className="p-2 bg-black/40 text-white"
                      onChange={e => {
                        const u = [...variants];
                        u[i].sizes[si].price = e.target.value;
                        setVariants(u);
                      }} />
                    <input placeholder="Qty" value={s.quantity} className="p-2 bg-black/40 text-white"
                      onChange={e => {
                        const u = [...variants];
                        u[i].sizes[si].quantity = e.target.value;
                        setVariants(u);
                      }} />
                    <input placeholder="SKU" value={s.sku} className="p-2 bg-black/40 text-white"
                      onChange={e => {
                        const u = [...variants];
                        u[i].sizes[si].sku = e.target.value;
                        setVariants(u);
                      }} />
                  </div>
                ))}
                <button onClick={() => addSize(i)} className="text-blue-400 mt-2 flex items-center gap-1">
                  <Plus size={16} /> Add Size
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addVariant}
          className="mt-6 text-purple-400 flex items-center gap-2"
        >
          <Plus /> Add Another Color Product
        </button>

        <button
          disabled={loading}
          onClick={submitItem}
          className="mt-10 w-full py-4 rounded-2xl bg-purple-600 text-white font-bold"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </motion.div>
    </div>
  );
};

export default CreateItem;