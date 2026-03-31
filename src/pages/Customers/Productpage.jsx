import React, { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Trash2, UploadCloud, Loader2 } from "lucide-react";
import { serverurl } from "../../App.jsx";
import { useSelector } from "react-redux";

// ================= CATEGORY LIST =================
const categoryList = {
  "Electronics & Appliances": [
    "Smartphones",
    "Feature Phones",
    "iPhones",
    "Phone Cases & Covers",
    "Chargers & Cables",
    "Power Banks",
    "Headphones & Earbuds",
    "Bluetooth Devices",
    "Refrigerators",
    "Microwave Ovens",
    "Air Conditioners",
    "Fans",
    "Heaters",
    "Vacuum Cleaners",
    "Washing Machines",
    "Dryers",
    "Home Appliances Accessories",
    "Smart Home Devices",
    "Projectors",
    "LED TVs",
    "OLED TVs",
    "QLED TVs",
    "Smart TVs",
    "TV Mounts",
  ],
  "Computers & Accessories": [
    "Laptops",
    "Desktops",
    "Monitors",
    "Keyboards",
    "Mouse",
    "Printers & Scanners",
    "External Storage",
    "RAM & Memory",
    "Graphic Cards",
    "Processors",
    "Motherboards",
    "Cooling Systems",
    "Networking Devices",
    "Computer Cables & Adapters",
    "Laptop Bags & Sleeves",
  ],
  "Wearables & Smart Devices": [
    "Smart Watches",
    "Fitness Trackers",
    "VR Headsets",
    "Smart Glasses",
    "Wearable Accessories",
    "Smart Rings",
  ],
  "Fashion & Apparel": [
    "Mens T-Shirts",
    "Mens Shirts",
    "Mens Jeans",
    "Mens Trousers",
    "Mens Jackets",
    "Mens Suits",
    "Mens Traditional Wear",
    "Mens Activewear",
    "Mens Underwear",
    "Womens Tops",
    "Womens Shirts",
    "Womens Dresses",
    "Womens Bra",
    "Womens Nightwear",
    "Womens Bikinisets",
    "Womens Beach wear",
    "Womens Underwear",
    "Womens Jeans & Pants",
    "Womens Skirts",
    "Womens Jackets & Blazers",
    "Womens Sarees",
    "Womens Abayas & Modest Fashion",
    "Womens Activewear",
    "Womens Lingerie",
    "Boys Clothing",
    "Girls Clothing",
    "Infants & Toddlers Clothing",
    "School Uniforms",
    "Boys Teens Clothing",
    "Girls Teens Clothing",
    "School Uniforms Teens",
    "Mens Plus Size Fashion",
    "Womens Plus Size Fashion",
  ],
  "Shoes & Footwear": [
    "Mens Casual Shoes",
    "Mens Formal Shoes",
    "Mens Sports Shoes",
    "Womens Heels",
    "Womens Flats",
    "Womens Sports Shoes",
    "Kids Shoes",
    "Sneakers",
    "Boots",
    "Sandals",
    "Slippers",
  ],
  "Beauty, Health & Personal Care": [
    "Makeup",
    "Skincare",
    "Hair Care",
    "Nail Care",
    "Perfumes & Fragrances",
    "Oud & ATAR",
    "Health Supplements",
    "Personal Care",
    "Medical Equipment",
    "First Aid",
    "Sexual Wellness Products",
    "Oral Care",
    "Shaving & Grooming",
  ],
  "Sports, Gym & Fitness": [
    "Gym Clothing",
    "Gym Equipment",
    "Fitness Accessories",
    "Outdoor Sports",
    "Indoor Sports",
    "Yoga & Pilates",
    "Cycling Gear",
    "Swimming Gear",
  ],
  "Toys, Kids & Baby Products": [
    "Action Figures",
    "Dolls",
    "Board Games",
    "Educational Toys",
    "Baby Clothing",
    "Baby Accessories",
    "Strollers & Car Seats",
    "Baby Feeding & Care",
    "Soft Toys",
    "Puzzles",
    "Building Blocks",
  ],
  "Grocery, Food & Beverages": [
    "Snacks",
    "Chocolates",
    "Beverages",
    "Staples",
    "Organic & Health Food",
    "Coffee & Tea",
    "Spices & Condiments",
    "Canned Food",
    "Instant Food",
    "Dairy Products",
  ],
  "Books, Music & Movies": [
    "Fiction",
    "Non-Fiction",
    "Textbooks",
    "Comics & Graphic Novels",
    "Music CDs",
    "Vinyl Records",
    "Movies & TV Shows",
    "Educational Books",
    "Self-Help Books",
    "Magazines & Journals",
  ],
  "Home & Kitchen": [
    "Kitchen Appliances",
    "Cookware & Bakeware",
    "Dinnerware",
    "Storage & Organization",
    "Home Decor",
    "Furniture",
    "Lighting",
    "Bedding & Linen",
    "Cleaning Supplies",
    "Curtains & Blinds",
    "Wall Art & Posters",
    "Home Improvement Tools",
  ],
  "Automotive & Industrial": [
    "Car Accessories",
    "Motorbike Accessories",
    "EV Vehicles & Scooters",
    "Automotive Tools",
    "Industrial Equipment",
    "Garage & Workshop",
    "Car Care & Cleaning",
    "Tyres & Wheels",
  ],
  "Pet Supplies": [
    "Dog Food",
    "Cat Food",
    "Pet Accessories",
    "Aquarium Supplies",
    "Pet Toys",
    "Pet Health & Care",
    "Bird Supplies",
    "Small Pet Supplies",
  ],
  "Jewelry & Watches": [
    "Mens Watches",
    "Womens Watches",
    "Rings",
    "Necklaces",
    "Earrings",
    "Bracelets",
    "Anklets",
    "Cufflinks",
    "Brooches",
  ],
  "Office & Stationery": [
    "Office Supplies",
    "Writing Instruments",
    "Planners & Notebooks",
    "Printers & Scanners",
    "Office Furniture",
    "Paper & Notepads",
    "Desk Organizers",
  ],
  "Hobbies, Art & Craft": [
    "Arts & Painting",
    "Craft Supplies",
    "Musical Instruments",
    "Photography",
    "DIY Kits",
    "Collectibles",
    "Model Kits",
    "Sewing & Knitting",
  ],
  "Travel & Luggage": [
    "Suitcases",
    "Backpacks",
    "Travel Accessories",
    "Travel Gadgets",
    "Duffel Bags",
    "Carry-On Bags",
    "Travel Organizers",
  ],
  "Gaming & Entertainment": [
    "Gaming Consoles",
    "PC Games",
    "Console Games",
    "Gaming Accessories",
    "Board Games",
    "VR Games",
    "Game Controllers",
  ],
  "Education & Learning": [
    "School Supplies",
    "Educational Kits",
    "Learning Books",
    "Online Courses",
    "Flash Cards",
    "STEM Kits",
    "Language Learning",
  ],
};

// ================= VARIANT TEMPLATE =================
const emptyvariant = () => ({
  colorname: "",
  colorhex: "#8000ff",
  sizes: [{ label: "", price: "", quantity: "", sku: "" }],
  images: [],
  video: null,
  imageFields: 1,
});

// ================= ENUM OPTIONS =================
const ageOptions = ["Kids", "Teens", "Adult", "All"];
const sexOptions = ["Male", "Female", "Unisex"];
const seasonOptions = ["Winter", "Summer", "All Season friendly"];
const Deliveryoptions = ["Standard", "Period", "Airways"];
const Conditionoption= ["New", "Used"];
const CreateItem = () => {
  const [loading, setLoading] = useState(false);

  const { shopData } = useSelector((state) => state.shop);
  const shopid = shopData?._id || "";

  const [basic, setBasic] = useState({
    title: "",
    description: "",
    tags: "",
    keywords: "",
    sku: "",
    barcode: "",
    slug: "",
    brand: "",
    model: "",
    specification: "",
    warranty: "",
    availableoffers: "",
    baseprice: "",
    discountpercent: "",
    currency: "USD",
    stockstatus: "In Stock",
    highlights: "",
    Condition: "",
    DisplayResolution: "",
    Deliverytype: "Standard",
    category: "",
    subcategory: "",
    age: "All",
    sex: "Unisex",
    material: "",
    season: "All Season friendly",
  });

  const [variants, setVariants] = useState([emptyvariant()]);
  const inputRefs = useRef({});

  const updateBasic = useCallback((key, value) => {
    setBasic((p) => ({ ...p, [key]: value }));
    if (inputRefs.current[key])
      inputRefs.current[key].style.width = `${Math.min(
        Math.max(value.length * 10 + 30, 100),
        600
      )}px`;
  }, []);

  const addVariant = () => setVariants((p) => [...p, emptyvariant()]);
  const removeVariant = (i) =>
    setVariants((p) => p.filter((_, idx) => idx !== i));
  const updateVariant = (i, key, value) =>
    setVariants((p) => {
      const u = [...p];
      u[i][key] = value;
      return u;
    });
  const addSize = (i) =>
    setVariants((p) => {
      const u = [...p];
      u[i].sizes.push({ label: "", price: "", quantity: "", sku: "" });
      return u;
    });
  const removeSize = (vi, si) =>
    setVariants((p) => {
      const u = [...p];
      u[vi].sizes.splice(si, 1);
      return u;
    });
  const handleImage = (e, vi, fi) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVariants((p) => {
      const u = [...p];
      u[vi].images[fi] = f;
      return u;
    });
  };
  const handleVideo = (e, vi) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setVariants((p) => {
      const u = [...p];
      u[vi].video = f;
      return u;
    });
  };
  const setImageFieldCount = (vi, c) => {
    const n = Math.min(Math.max(parseInt(c) || 1, 1), 30);
    setVariants((p) => {
      const u = [...p];
      u[vi].imageFields = n;
      u[vi].images = u[vi].images.slice(0, n);
      return u;
    });
  };

  const canSubmit = useMemo(() => {
    return (
      !loading &&
      shopid.length === 24 &&
      basic.title.trim() &&
      basic.category &&
      basic.subcategory &&
      variants.every((v) => v.colorname.trim())
    );
  }, [loading, shopid, basic, variants]);

  const submitItem = async () => {
    if (!canSubmit) return toast.error("Fill all required fields");
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(basic).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      fd.append("shopid", shopid);
      fd.append(
        "colorvariants",
        JSON.stringify(
          variants.map((v) => ({
            colorname: v.colorname.trim(),
            colorhex: v.colorhex,
            sizes: v.sizes,
          }))
        )
      );
      variants.forEach((v) => {
        v.images.forEach((file) => {
          if (file) fd.append(`images_${v.colorname}`, file);
        });
        if (v.video) fd.append(`video_${v.colorname}`, v.video);
      });
      await axios.post(`${serverurl}/item/create`, fd, {
        withCredentials: true,
      });
      toast.success("Product created successfully");
      setBasic({
        title: "",
        description: "",
        tags: "",
        keywords: "",
        DisplayResolution: "",
        Deliverytype: "Standard",
        Condition:"New",
        sku: "",
        barcode: "",
        slug: "",
        brand: "",
        model: "",
        highlights: "",
        specification: "",
        warranty: "",
        availableoffers: "",
        baseprice: "",
        discountpercent: "",
       
        currency: "USD",
        stockstatus: "In Stock",
        category: "",
        subcategory: "",
        age: "All",
        sex: "Unisex",
        material: "",
        season: "All Season friendly",
      });
      setVariants([emptyvariant()]);
    } catch (e) {
      toast.error(e.response?.data?.message || "Create item failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#2a004d] to-[#12001f] p-6">
      <Toaster />
      <div className="absolute inset-0 bg-purple-900/20 backdrop-blur-2xl z-0 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          Create Product – Merkova Seller
        </h1>

        {/* BASIC INPUTS */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            "title",
            "description",
            "tags",
            "keywords",
            "sku",
            "highlights",
            "barcode",
            "slug",
            "brand",
            "model",
            "specification",
            "warranty",
            "Condition",
            "Deliverytype",
        
    
            "availableoffers",
            "baseprice",
            "discountpercent",
            "currency",
            "stockstatus",
          ].map((k) => (
            <input
              key={k}
              value={basic[k]}
              ref={(el) => (inputRefs.current[k] = el)}
              onChange={(e) => updateBasic(k, e.target.value)}
              placeholder={k.toUpperCase()}
              className="p-3 rounded-xl bg-black/40 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-500 transition w-full"
            />
          ))}
          <select
            value={basic.category}
            onChange={(e) => updateBasic("category", e.target.value)}
            className="p-3 rounded-xl bg-black/40 text-white w-full"
          >
            <option value="">Select Category</option>
            {Object.keys(categoryList).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={basic.subcategory}
            onChange={(e) => updateBasic("subcategory", e.target.value)}
            className="p-3 rounded-xl bg-black/40 text-white w-full"
          >
            <option value="">Select Subcategory</option>
            {basic.category &&
              categoryList[basic.category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
          <select
            value={basic.age}
            onChange={(e) => updateBasic("age", e.target.value)}
            className="p-3 rounded-xl bg-black/40 text-white w-full"
          >
            {ageOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select
            value={basic.sex}
            onChange={(e) => updateBasic("sex", e.target.value)}
            className="p-3 rounded-xl bg-black/40 text-white w-full"
          >
            {sexOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={basic.season}
            onChange={(e) => updateBasic("season", e.target.value)}
            className="p-3 rounded-xl bg-black/40 text-white w-full"
          >
            {seasonOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={basic.Deliveryoptions}
            onChange={(e) => updateBasic("Deliverytype", e.target.value)}
            className="p-3 rounded-xl bg-black/40 text-white w-full"
          >
            {Deliveryoptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={basic.Conditionoption}
            onChange={(e) => updateBasic("Condition", e.target.value)}
            className="p-3 rounded-xl bg-black/40 text-white w-full"
          >
            {Conditionoption.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            value={basic.material}
            onChange={(e) => updateBasic("material", e.target.value)}
            placeholder="Material"
            className="p-3 rounded-xl bg-black/40 text-white w-full"
          />
        </div>

        {/* VARIANTS */}
        <div className="mt-10 space-y-10">
          <AnimatePresence>
            {variants.map((v, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="border border-white/10 p-6 rounded-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-white font-semibold">
                    Color Variant {i + 1}
                  </h2>
                  {variants.length > 1 && (
                    <Trash2
                      className="text-red-500 cursor-pointer"
                      onClick={() => removeVariant(i)}
                    />
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    value={v.colorname}
                    onChange={(e) =>
                      updateVariant(i, "colorname", e.target.value)
                    }
                    placeholder="Color Name"
                    className="p-3 rounded-xl bg-black/40 text-white"
                  />
                  <input
                    type="color"
                    value={v.colorhex}
                    onChange={(e) =>
                      updateVariant(i, "colorhex", e.target.value)
                    }
                    className="w-20 h-10 rounded-lg"
                  />
                </div>

                {/* IMAGES */}
                <div className="mt-4">
                  <label className="text-white">Images (1–30)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={v.imageFields}
                    onChange={(e) => setImageFieldCount(i, e.target.value)}
                    className="ml-4 w-24 p-2 rounded-xl bg-black/40 text-white"
                  />
                  <div className="grid md:grid-cols-5 gap-3 mt-4">
                    {Array.from({ length: v.imageFields }).map((_, idx) => (
                      <label
                        key={idx}
                        className="flex flex-col items-center justify-center gap-2 border border-dashed border-purple-400/40 rounded-xl p-3 cursor-pointer hover:bg-purple-500/10"
                      >
                        <UploadCloud className="text-purple-400" />
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleImage(e, i, idx)}
                        />
                        {v.images[idx] && (
                          <img
                            src={URL.createObjectURL(v.images[idx])}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* VIDEO */}
                <div className="mt-6">
                  <label className="text-white">Variant Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideo(e, i)}
                  />
                </div>

                {/* SIZES */}
                <div className="mt-6">
                  <h3 className="text-white mb-3">Sizes</h3>
                  {v.sizes.map((s, si) => (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="grid md:grid-cols-5 gap-2 mb-2"
                    >
                      {Object.keys(s).map((f) => (
                        <input
                          key={f}
                          value={s[f]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setVariants((p) => {
                              const u = [...p];
                              u[i].sizes[si][f] = val;
                              return u;
                            });
                          }}
                          placeholder={f.toUpperCase()}
                          className="p-2 bg-black/40 text-white rounded-lg"
                        />
                      ))}
                      {v.sizes.length > 1 && (
                        <Trash2
                          className="text-red-500 cursor-pointer mt-2"
                          onClick={() => removeSize(i, si)}
                        />
                      )}
                    </motion.div>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addSize(i)}
                    className="text-purple-400 mt-2 flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Size
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-4 mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addVariant}
            className="px-6 py-3 rounded-xl border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition flex items-center gap-1"
          >
            <Plus className="inline" /> Add Color Variant
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={submitItem}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-purple-700 text-white font-bold hover:bg-purple-800 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Product"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateItem;