import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux"; // Redux integration
import { motion, AnimatePresence } from "framer-motion";
import {serverurl} from "../App.jsx"
import { 
  Upload, Plus, Trash2, Save, Layers, Tag, DollarSign, 
  Box, Truck, Camera, Video, Monitor, Globe, FileText, 
  Activity, CheckCircle, Image as ImageIcon, X 
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
// ================= THEME CONSTANTS =================
const MERKOVA_THEME = {
  bg: "bg-[#050b14]",
  card: "bg-[#0f172a]/80",
  border: "border-blue-500/20",
  input: "bg-[#1e293b] border-blue-900/50 focus:border-blue-400 text-blue-50 placeholder-blue-700/50",
  accent: "from-blue-600 to-indigo-600",
  glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]"
};

const FADE_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// ================= CATEGORY DATA (FROM YOUR LIST) =================
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
    "Mens Polo T-Shirt",
    
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
  "Girls": [
  "Girls Clothing",
  "Tops & T-Shirts",
  "Dresses & Frocks",
  "Skirts & Shorts",
  "Leggings & Jeggings",
  "Ethnic Wear",
  "Winter Wear",
  "Sleepwear",
  "Girls Footwear",
  "Casual Shoes",
  "School Shoes",
  "Party Shoes",
  "Sandals & Flats",
  "Girls Accessories",
  "Hair Accessories",
  "Bags & Purses",
  "Watches",
  "Girls Toys",
  "Dolls & Dollhouses",
  "Creative & Craft Toys",
  "Educational Toys"
]
,
"Boys": [
  "Boys Clothing",
  "T-Shirts & Tops",
  "Shirts",
  "Jeans & Trousers",
  "Shorts",
  "Ethnic Wear",
  "Winter Wear",
  "Sleepwear",
  "Boys Footwear",
  "Casual Shoes",
  "School Shoes",
  "Sports Shoes",
  "Sandals & Flip-Flops",
  "Boys Accessories",
  "Bags & Backpacks",
  "Caps & Hats",
  "Watches",
  "Boys Toys",
  "Action Figures",
  "Remote Control Toys",
  "Learning & STEM Toys"
]
,
"Baby & Kids": [
  "Baby Clothing",
  "Newborn Essentials",
  "Diapers & Wipes",
  "Baby Feeding",
  "Baby Food & Formula",
  "Baby Care & Grooming",
  "Baby Health & Safety",
  "Baby Gear",
  "Strollers & Prams",
  "Car Seats",
  "Baby Furniture",
  "Cribs & Cots",
  "Baby Bedding",
  "Baby Toys",
  "Educational Toys",
  "Baby Bath & Skincare",
  "Maternity Essentials",
  "Breastfeeding Accessories"
]
,

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

const shippingOptions = {
  deliverytype: [
    { label: "Merkova Standard", info: "Delivery: 0-7 days" },
    { label: "Express", info: "Delivery: 3-4 days" },
    { label: "International Delivery", info: "Delivery: 0-14 days" }
  ],
  shipsfrom: [
    { label: "Local WareHouse", info: "Ships locally From Your Delivery Partners" },
    { label: "From Merkova", info: "Ships from Merkova (Merkova Delivery Your Product To The Customer)" },
    { label: "Airways", info: "Air shipment (Interantion Delivery From Merkova)" }
  ]
};

// ================= REUSABLE COMPONENTS =================

const InputGroup = ({ label, name, value, onChange, type = "text", placeholder, required = false, width = "w-full", disabled=false }) => (
  <div className={`flex flex-col gap-1.5 ${width}`}>
    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1 flex items-center gap-1">
      {label} {required && <span className="text-pink-500">*</span>}
    </label>
    <div className="relative group">
      <input
        type={type}
        name={name}
        value={value === undefined ? "" : value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full ${MERKOVA_THEME.input} ${disabled ? "opacity-50 cursor-not-allowed" : ""} rounded-xl px-4 py-3.5 outline-none transition-all duration-300 group-hover:border-blue-400 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300" />
    </div>
  </div>
);

const ToggleSwitch = ({ label, checked, onChange }) => (
  <div onClick={() => onChange(!checked)} className={`flex items-center justify-between ${MERKOVA_THEME.input} p-3.5 rounded-xl cursor-pointer hover:bg-[#26334d] transition-colors border border-blue-900/30`}>
    <span className="text-sm font-semibold text-blue-200">{label}</span>
    <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${checked ? "bg-blue-500" : "bg-slate-700"}`}>
      <motion.div
        layout
        className="absolute w-5 h-5 bg-white rounded-full top-0.5 shadow-md"
        initial={false}
        animate={{ left: checked ? "1.35rem" : "0.15rem" }}
      />
    </div>
  </div>
);

// ================= MAIN COMPONENT =================

const MerkovaCreateItem = () => {
  // 1. REDUX INTEGRATION FOR SHOP ID
  const { shopData } = useSelector((state) => state.shop);
  const shopid=shopData?._id
  const [loading, setLoading] = useState(false);

  // 2. MONOLITHIC FORM STATE
  const [form, setForm] = useState({
    title: "", subtitle: "", slug: "", description: "", highlights: "",
    tags_text: "", keywords: [], sku: "", brand: "", brandstory: "", 
    brandorigin: "", modelnumber: "", serialnumber: "", warranty: "",
    categoryname: "", subcategories: [],
    pricing: { baseprice: 0, discountpercent: 0, currency: "BDT" },
    modelinfo: { modelname: "", required: { height: "", chest: "" }, optional: {} },
    attributes: {}, // Generic bag for all attributes
    shipping: { 
        weight: "", dimensions: { length: "", width: "", height: "" }, 
        isdangerous: false, deliverytype: "Standard", shipsfrom: "", 
        shippingfee: 0, freedelivery: false, handlingtime: "" 
    },
    brandmedia: [], 
    stockstatus: "In Stock"
  });

  const [colorVariants, setColorVariants] = useState([]);
  const [activeCategorySubs, setActiveCategorySubs] = useState([]);

  // 3. AUTO-POPULATE SHOP ID & SUBCATEGORIES
  useEffect(() => {
    if (form.categoryname && categoryList[form.categoryname]) {
      setActiveCategorySubs(categoryList[form.categoryname]);
    } else {
      setActiveCategorySubs([]);
    }
  }, [form.categoryname]);

  // 4. HANDLERS

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDeepChange = (parent, field, value) => {
    setForm(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  // --- Shipping Logic: Reset fee if free delivery ---
  const handleShippingChange = (field, value) => {
    setForm(prev => {
        const newShipping = { ...prev.shipping, [field]: value };
        if (field === 'freedelivery' && value === true) {
            newShipping.shippingfee = 0; // Logic Fix
        }
        return { ...prev, shipping: newShipping };
    });
  };

  // --- Dynamic Media Logic ("Write 5 Get 5") ---
  const handleVariantMediaCount = (vIdx, type, count) => {
    const updated = [...colorVariants];
    const currentFiles = updated[vIdx][type];
    
    updated[vIdx][`${type}SlotCount`] = count;
    setColorVariants(updated);
  };

  const handleVariantFileDrop = (vIdx, type, file, slotIndex) => {
    const updated = [...colorVariants];
    // Ensure array exists
    if (!updated[vIdx][type]) updated[vIdx][type] = [];
    updated[vIdx][type][slotIndex] = file; 
    // Clean undefined/empty slots only on submit, keep index for UI
    setColorVariants(updated);
  };

  // --- Brand Media Logic (Super Coolest Preview) ---
  const addBrandMediaBlock = () => {
    setForm(prev => ({
      ...prev,
      brandmedia: [...prev.brandmedia, { 
        sectiontype: "single", title: "", subtitle: "", 
        images: [], videos: [], maximages: 100 
      }]
    }));
  };

  const handleBrandMediaUpload = (idx, files) => {
    const updated = [...form.brandmedia];
    const block = updated[idx];
    
    // Logic: Single vs Carousel
    if (block.sectiontype === 'single') {
        // Only take the first file, replace existing
        block.images = [files[0]]; 
    } else {
        // Carousel: Append new files to existing, limit by maximages
        const combined = [...block.images, ...Array.from(files)];
        block.images = combined.slice(0, block.maximages);
    }
    setForm({ ...form, brandmedia: updated });
  };

  const removeBrandImage = (blockIdx, imgIdx) => {
    const updated = [...form.brandmedia];
    updated[blockIdx].images = updated[blockIdx].images.filter((_, i) => i !== imgIdx);
    setForm({ ...form, brandmedia: updated });
  };

  // 5. SUBMIT FUNCTION (BACKEND FRIENDLY)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!shopid?._id) return toast.error("Shop not authenticated!");
    
    setLoading(true);
    const formData = new FormData();

    // Core Fields
    Object.keys(form).forEach(key => {
        if (['pricing', 'modelinfo', 'attributes', 'shipping', 'keywords', 'subcategories'].includes(key)) {
            formData.append(key, JSON.stringify(form[key]));
        } else if (key !== 'brandmedia' && key !== 'colorvariants') {
            formData.append(key, form[key]);
        }
    });

    // Add Shop ID explicitly
    formData.append('shopid', shopid);

    // Variants (JSON Data)
    // Clean the arrays to remove empty slots before sending
    const cleanedVariants = colorVariants.map(v => ({
        ...v,
        images: undefined, // Don't send file objects in JSON
        videos: undefined
    }));
    formData.append('colorvariants', JSON.stringify(cleanedVariants));

    // Variants (Files)
    colorVariants.forEach(variant => {
        variant.images?.forEach(file => {
            if(file) formData.append(`images_${variant.colorname}`, file);
        });
        variant.videos?.forEach(file => {
            if(file) formData.append(`video_${variant.colorname}`, file);
        });
    });

    // Brand Media (JSON Data)
    const cleanedBrandMedia = form.brandmedia.map(b => ({
        ...b,
        images: undefined // Don't send file objects in JSON
    }));
    formData.append('brandmedia', JSON.stringify(cleanedBrandMedia));

    // Brand Media (Files)
    // Convention: brandmedia_index_images
    form.brandmedia.forEach((block, idx) => {
        block.images.forEach(file => {
            formData.append(`brandmedia_${idx}_images`, file);
        });
    });

    try {
        const res = await axios.post(`${serverurl}/item/create`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        });
        toast.success("Item Deployed to Merkova Successfully!");
        console.log(res.data);
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Deployment Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${MERKOVA_THEME.bg} text-blue-50 font-sans pb-32`}>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' } }} />

      {/* === HEADER === */}
      <div className="sticky top-0 z-50 bg-[#050b14]/80 backdrop-blur-xl border-b border-blue-900/30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${MERKOVA_THEME.accent} flex items-center justify-center shadow-lg shadow-blue-500/30`}>
                <Layers className="text-white" size={20} />
            </div>
            <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
                    Merkova Seller Center
                </h1>
                <p className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">
                   Shop: {shopData?.name || "Loading..."}
                </p>
            </div>
        </div>
        <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 ${loading ? "bg-slate-700" : `bg-gradient-to-r ${MERKOVA_THEME.accent} shadow-blue-600/30 shadow-lg`}`}
        >
            {loading ? <Activity className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? "Deploying..." : "Deploy Item"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8 mt-4">

        {/* === 1. GLOBAL IDENTITY === */}
        <motion.div variants={FADE_VARIANTS} initial="hidden" animate="visible" className={`p-8 rounded-3xl border ${MERKOVA_THEME.border} ${MERKOVA_THEME.card} backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-blue-900/30">
                <Globe className="text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Item Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputGroup label="Item Title" name="title" value={form.title} onChange={handleBasicChange} placeholder="Item Tittle" required width="md:col-span-2" />
                <InputGroup label="Slug" name="slug" value={form.slug} onChange={handleBasicChange} placeholder="Slug for seo in Merkova" />
                
                <div className="md:col-span-3">
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1 mb-2 block">Description</label>
                    <textarea 
                        name="description" 
                        value={form.description} 
                        onChange={handleBasicChange} 
                        className={`w-full h-32 rounded-xl px-4 py-3 outline-none ${MERKOVA_THEME.input}`} 
                        placeholder="Description For Product..." 
                    />
                </div>
                 <div className="md:col-span-3">
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest ml-1 mb-2 block">Highlights</label>
                    <textarea 
                        name="highlights" 
                        value={form.highlights} 
                        onChange={handleBasicChange} 
                        className={`w-full h-32 rounded-xl px-4 py-3 outline-none ${MERKOVA_THEME.input}`} 
                        placeholder="Highlights of your product(Bullet Points Are Must)" 
                    />
                </div>
                
                <InputGroup label="Brand" name="brand" value={form.brand} onChange={handleBasicChange} />
                <InputGroup label="SKU" name="sku" value={form.sku} onChange={handleBasicChange} />
                <InputGroup label="Warranty" name="warranty" value={form.warranty} onChange={handleBasicChange} />
            </div>
        </motion.div>

        {/* === 2. CATEGORY & PRICING === */}
        <motion.div variants={FADE_VARIANTS} initial="hidden" animate="visible" transition={{delay:0.1}} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CATEGORY SELECTOR */}
            <div className={`p-8 rounded-3xl border ${MERKOVA_THEME.border} ${MERKOVA_THEME.card}`}>
                <div className="flex items-center gap-3 mb-6 text-blue-300">
                    <Tag size={20} /> <h3 className="text-xl font-bold">Categorization</h3>
                </div>
                <div className="space-y-5">
                    <div>
                        <label className="text-xs font-bold text-blue-400 uppercase mb-2 block">Main Category</label>
                        <select 
                            name="categoryname" 
                            value={form.categoryname} 
                            onChange={handleBasicChange} 
                            className={`w-full ${MERKOVA_THEME.input} rounded-xl px-4 py-3.5 appearance-none cursor-pointer`}
                        >
                            <option value="">Select Category</option>
                            {Object.keys(categoryList).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    {activeCategorySubs.length > 0 && (
                        <div>
                            <label className="text-xs font-bold text-blue-400 uppercase mb-2 block">Sub-Category</label>
                            <select 
                                onChange={(e) => setForm({...form, subcategories: [e.target.value]})} 
                                className={`w-full ${MERKOVA_THEME.input} rounded-xl px-4 py-3.5 appearance-none cursor-pointer`}
                            >
                                <option value="">Select Sub-Category</option>
                                {activeCategorySubs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* PRICING ENGINE */}
            <div className={`p-8 rounded-3xl border ${MERKOVA_THEME.border} ${MERKOVA_THEME.card}`}>
                <div className="flex items-center gap-3 mb-6 text-blue-300">
                    <DollarSign size={20} /> <h3 className="text-xl font-bold">Pricing Engine</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <InputGroup 
  type="number" 
  placeholder="Base Price" 
  value={form.pricing.baseprice} 
  onChange={(e) => handleDeepChange('pricing', 'baseprice', Number(e.target.value))} 
/>

<InputGroup 
  type="number" 
  placeholder="Discount %" 
  value={form.pricing.discountpercent} 
  onChange={(e) => handleDeepChange('pricing', 'discountpercent',Number(e.target.value))} 
/>

                    <div className="col-span-2 mt-2 p-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-xl border border-blue-500/30 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase text-blue-300">Calculated Final Price</span>
                        <span className="text-2xl font-bold text-white">
                            {form.pricing.currency} {Math.round(form.pricing.baseprice * (1 - form.pricing.discountpercent/100))}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* === 3. ADVANCED VARIANTS (COLOR + SIZE + MEDIA) === */}
        <motion.div variants={FADE_VARIANTS} initial="hidden" animate="visible" transition={{delay:0.2}} className={`p-8 rounded-3xl border border-blue-500/30 bg-[#0a101d] shadow-2xl`}>
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3 text-blue-200">
                    <Layers size={24} /> <h2 className="text-2xl font-bold">Product Variants</h2>
                </div>
                <button 
                    onClick={() => setColorVariants([...colorVariants, { colorname: "", colorhex: "#000000", images: [], videos: [], sizes: [] }])}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                >
                    <Plus size={18} /> Add Variant
                </button>
             </div>

             <div className="space-y-8">
                {colorVariants.map((variant, vIdx) => (
                    <div key={vIdx} className="relative p-6 rounded-2xl border border-blue-800/40 bg-[#111827]">
                        {/* Remove Variant Button */}
                        <button 
                            onClick={() => setColorVariants(colorVariants.filter((_, i) => i !== vIdx))}
                            className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="flex gap-6 mb-8">
                            <InputGroup label="Color Name" value={variant.colorname} onChange={(e) => {
                                const updated = [...colorVariants]; updated[vIdx].colorname = e.target.value; setColorVariants(updated);
                            }} placeholder="e.g. Midnight Blue" width="w-1/3" />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Hex</label>
                                <div className="flex items-center gap-3 p-2 bg-[#1e293b] rounded-xl border border-blue-900/50">
                                    <input type="color" value={variant.colorhex} onChange={(e) => {
                                        const updated = [...colorVariants]; updated[vIdx].colorhex = e.target.value; setColorVariants(updated);
                                    }} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none" />
                                    <span className="text-sm font-mono text-blue-200">{variant.colorhex}</span>
                                </div>
                            </div>
                        </div>

                        {/* === THE "WRITE 5 GET 5" MEDIA UPLOADER === */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {['images', 'videos'].map((type) => (
                                <div key={type} className="bg-[#0b101b] p-4 rounded-xl border border-blue-900/30 border-dashed">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-bold text-blue-300 flex items-center gap-2 capitalize">
                                            {type === 'images' ? <Camera size={16} /> : <Video size={16} />} 
                                            Variant {type}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-blue-500 uppercase">Slots</span>
                                            <input 
                                                type="number" 
                                                min="1" max="20"
                                                value={variant[`${type}SlotCount`] || 1}
                                                onChange={(e) => handleVariantMediaCount(vIdx, type, parseInt(e.target.value))}
                                                className="w-12 bg-blue-900/20 text-center text-white text-xs py-1 rounded border border-blue-800 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                        {Array.from({ length: Math.max(variant[`${type}SlotCount`] || 1, (variant[type]?.length || 0)) }).map((_, slotIdx) => (
                                            <div key={slotIdx} className="aspect-square relative group bg-[#161e2e] rounded-lg border border-blue-900/40 flex items-center justify-center overflow-hidden">
                                                {variant[type]?.[slotIdx] ? (
                                                    <div className="relative w-full h-full">
                                                        {type === 'images' ? (
                                                            <img src={URL.createObjectURL(variant[type][slotIdx])} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <video src={URL.createObjectURL(variant[type][slotIdx])} className="w-full h-full object-cover" />
                                                        )}
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleVariantFileDrop(vIdx, type, null, slotIdx)}
                                                            className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-red-600 transition-colors"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-blue-500/50 hover:text-blue-400 transition-colors">
                                                        <Upload size={16} />
                                                        <span className="text-[9px] mt-1">{slotIdx + 1}</span>
                                                        <input 
                                                            type="file" 
                                                            accept={type === 'images' ? "image/*" : "video/*"}
                                                            className="hidden" 
                                                            onChange={(e) => handleVariantFileDrop(vIdx, type, e.target.files[0], slotIdx)}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* End Media Uploader */}

                        {/* SIZES */}
                       {/* ================= SIZE PRICING & INVENTORY ================= */}
<div className="bg-[#1e293b]/50 p-5 rounded-2xl border border-blue-800/20">

  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
      Size Pricing & Inventory
    </h4>

    <button
      type="button"
      onClick={() => {
        const updated = [...colorVariants];

        updated[vIdx].sizes = [
          ...(updated[vIdx].sizes || []),
          {
            label: "",
            sku: "",
            quantity: 0,
            price: {
              baseprice: 0,
              discountpercent: 0,
              currentprice: 0,
              currency: form.pricing.currency || "BDT"
            }
          }
        ];

        setColorVariants(updated);
      }}
      className="text-xs bg-blue-600 px-4 py-1.5 rounded-lg text-white hover:bg-blue-500 transition cursor-pointer"
    >
      + Add Size
    </button>
  </div>

  {/* Size Rows */}
  {(variant.sizes || []).map((sizeItem, sIdx) => {

    const finalprice = sizeItem.price?.currentprice || 0;

    return (
      <div
        key={sIdx}
        className="mb-4 p-4 rounded-xl bg-[#020617]/60 border border-blue-500/10"
      >
        <div className="grid grid-cols-6 gap-3 items-center">

          {/* Size Label */}
          <InputGroup
            placeholder="Size (XL)"
            value={sizeItem.label}
            onChange={(e) => {
              const updated = [...colorVariants];
              updated[vIdx].sizes[sIdx].label = e.target.value;
              setColorVariants(updated);
            }}
          />

          {/* SKU */}
          <InputGroup
            placeholder="SKU"
            value={sizeItem.sku}
            onChange={(e) => {
              const updated = [...colorVariants];
              updated[vIdx].sizes[sIdx].sku = e.target.value;
              setColorVariants(updated);
            }}
          />

          {/* Quantity */}
          <InputGroup
            type="number"
            placeholder="Stock"
            value={sizeItem.quantity}
            onChange={(e) => {
              const updated = [...colorVariants];
              updated[vIdx].sizes[sIdx].quantity = Number(e.target.value);
              setColorVariants(updated);
            }}
          />

          {/* Base Price */}
          <InputGroup
            type="number"
            placeholder="Base Price"
            value={sizeItem.price.baseprice}
            onChange={(e) => {
              const baseprice = Number(e.target.value) || 0;

              const updated = [...colorVariants];
              const discount = updated[vIdx].sizes[sIdx].price.discountpercent || 0;

              updated[vIdx].sizes[sIdx].price.baseprice = baseprice;
              updated[vIdx].sizes[sIdx].price.currentprice = Math.round(
                baseprice * (1 - discount / 100)
              );

              setColorVariants(updated);
            }}
          />

          {/* Discount Percent */}
          <InputGroup
            type="number"
            placeholder="Discount %"
            value={sizeItem.price.discountpercent}
            onChange={(e) => {
              const discount = Number(e.target.value) || 0;

              const updated = [...colorVariants];
              const baseprice = updated[vIdx].sizes[sIdx].price.baseprice || 0;

              updated[vIdx].sizes[sIdx].price.discountpercent = discount;
              updated[vIdx].sizes[sIdx].price.currentprice = Math.round(
                baseprice * (1 - discount / 100)
              );

              setColorVariants(updated);
            }}
          />

          {/* Remove */}
          <button
            type="button"
            onClick={() => {
              const updated = [...colorVariants];
              updated[vIdx].sizes.splice(sIdx, 1);
              setColorVariants(updated);
            }}
            className="text-red-400 hover:text-red-300 justify-self-center transition cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Final Price Display */}
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-blue-300">
            Calculated Final Price
          </span>
          <span className="text-xl font-bold text-white">
            {sizeItem.price.currency} {finalprice}
          </span>
        </div>
      </div>
    );
  })}
</div>


                    </div>
                ))}
             </div>
        </motion.div>

        {/* === 4. BRAND MEDIA (THE COOL SINGLE/CAROUSEL LOGIC) === */}
        <motion.div variants={FADE_VARIANTS} initial="hidden" animate="visible" transition={{delay:0.3}} className={`p-8 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#0f172a] to-[#140f2a]`}>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3 text-purple-300">
                    <Monitor size={24} /> <h2 className="text-2xl font-bold">Brand Media Blocks</h2>
                </div>
                <button onClick={addBrandMediaBlock} className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-bold text-white hover:bg-purple-500 transition-all">+ Add Section</button>
            </div>

            <div className="space-y-6">
                {form.brandmedia.map((block, idx) => (
                    <div key={idx} className="bg-[#050b14]/50 p-6 rounded-2xl border border-purple-500/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold text-purple-400 uppercase mb-1 block">Display Type</label>
                                <select 
                                    value={block.sectiontype} 
                                    onChange={(e) => {
                                        const updated = [...form.brandmedia];
                                        updated[idx].sectiontype = e.target.value;
                                        // Reset images if switching to single to avoid mess
                                        if(e.target.value === 'single') updated[idx].images = updated[idx].images.slice(0,1);
                                        setForm({...form, brandmedia: updated});
                                    }}
                                    className={`w-full ${MERKOVA_THEME.input} rounded-xl px-4 py-3`}
                                >
                                    <option value="single">Single Hero Image</option>
                                    <option value="carousel">Carousel (Slider)</option>
                                </select>
                            </div>
                            <InputGroup label="Title" value={block.title} onChange={(e) => {
                                const updated = [...form.brandmedia]; updated[idx].title = e.target.value; setForm({...form, brandmedia: updated});
                            }} />
                        </div>

                        {/* === THE AMAZING PREVIEWER === */}
                        <div className="bg-[#1e293b]/30 p-4 rounded-xl border border-dashed border-purple-500/40">
                             <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold text-purple-200">
                                    {block.sectiontype === 'single' ? "Upload Hero Image (1)" : `Upload Carousel Images (Max ${block.maximages})`}
                                </span>
                                <label className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-2">
                                    <Upload size={14} /> Select Files
                                    <input 
                                        type="file" 
                                        multiple={block.sectiontype === 'carousel'} 
                                        accept="image/*"
                                        className="hidden" 
                                        onChange={(e) => handleBrandMediaUpload(idx, e.target.files)} 
                                    />
                                </label>                             </div>

                             {/* GRID VIEW FOR CAROUSEL / SINGLE VIEW FOR SINGLE */}
                             <div className={`grid gap-3 ${block.sectiontype === 'single' ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'}`}>
                                {block.images.map((img, imgIdx) => (
                                    <div key={imgIdx} className="relative aspect-video rounded-lg overflow-hidden border border-purple-500/30 group">
                                        <img src={URL.createObjectURL(img)} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="preview" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                type="button" 
                                                onClick={() => removeBrandImage(idx, imgIdx)}
                                                className="bg-red-600 p-2 rounded-full text-white hover:bg-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white">
                                            {imgIdx + 1}
                                        </div>
                                    </div>
                                ))}
                                {block.images.length === 0 && (
                                    <div className="col-span-full py-8 text-center text-purple-400/40 text-sm">
                                        No images selected. Click button above.
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>

        {/* === 5. SHIPPING (WITH SMART FREE DELIVERY LOGIC) === */}
        <motion.div variants={FADE_VARIANTS} initial="hidden" animate="visible" transition={{delay:0.4}} className={`p-8 rounded-3xl border ${MERKOVA_THEME.border} ${MERKOVA_THEME.card}`}>
            <div className="flex items-center gap-3 mb-6 text-blue-300">
                <Truck size={20} /> <h3 className="text-xl font-bold">Logistics & Shipping</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                     <InputGroup label="Weight (kg)" value={form.shipping.weight} onChange={(e) => handleShippingChange('weight', e.target.value)} />
                     <ToggleSwitch label="Free Delivery" checked={form.shipping.freedelivery} onChange={(val) => handleShippingChange('freedelivery', val)} />
                     
                     {/* SMART SHIPPING FEE LOGIC */}
                     {!form.shipping.freedelivery && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}}>
                             <InputGroup label="Shipping Fee" type="number" value={form.shipping.shippingfee} onChange={(e) => handleShippingChange('shippingfee', e.target.value)} />
                        </motion.div>
                     )}
                     {form.shipping.freedelivery && (
                        <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-xl flex items-center gap-2 text-green-400 text-xs font-bold">
                            <CheckCircle size={14} /> Shipping Fee is now 0
                        </div>
                     )}
                </div>
                <div className="space-y-4">
                     <InputGroup label="Length" value={form.shipping.dimensions.length} onChange={(e) => setForm({...form, shipping: {...form.shipping, dimensions: {...form.shipping.dimensions, length: e.target.value}}})} />
                     <InputGroup label="Width" value={form.shipping.dimensions.width} onChange={(e) => setForm({...form, shipping: {...form.shipping, dimensions: {...form.shipping.dimensions, width: e.target.value}}})} />
                     <InputGroup label="Height" value={form.shipping.dimensions.height} onChange={(e) => setForm({...form, shipping: {...form.shipping, dimensions: {...form.shipping.dimensions, height: e.target.value}}})} />
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
      
      {/* Handling Time */}
      <div>
        <label className="block text-xs font-bold text-blue-500 uppercase mb-1">
          Handling Time
        </label>
        <input
          type="text"
          value={form.shipping.handlingtime}
          onChange={(e) => handleShippingChange("handlingtime", e.target.value)}
          className="w-full rounded-xl px-4 py-3 border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., 1-3 days"
        />
      </div>

      {/* Ships From */}
      <div>
        <label className="block text-xs font-bold text-blue-500 uppercase mb-1">
          Ships From
        </label>
        <div className="relative">
          <select
            value={form.shipping.shipsfrom}
                            
            onChange={(e) => handleShippingChange("shipsfrom", e.target.value)}
            className={`w-full ${MERKOVA_THEME.input} rounded-xl px-4 py-3.5 appearance-none cursor-pointer-full rounded-xl px-4 py-3 border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none appearance-none`}
          >
            {shippingOptions.shipsfrom.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Question mark tooltip */}
          <span
            data-tooltip-id={`shipsfrom-tooltip`}
            data-tooltip-content={
              shippingOptions.shipsfrom.find((o) => o.label === form.shipping.shipsfrom)?.info
            }
            className="absolute right-3 top-3 text-blue-500 cursor-pointer font-bold"
          >
            ?
          </span>
        </div>
      </div>

      {/* Delivery Type */}
      <div>
        <label className="block text-xs font-bold text-blue-500 uppercase mb-1">
          Delivery Type
        </label>
        <div className="relative">
          <select
            value={form.shipping.deliverytype}
            onChange={(e) => handleShippingChange("deliverytype", e.target.value)}
            className={`w-full ${MERKOVA_THEME.input} rounded-xl px-4 py-3.5 appearance-none cursor-pointer-full rounded-xl px-4 py-3 border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none appearance-none`}
          >
            {shippingOptions.deliverytype.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            data-tooltip-id={`deliverytype-tooltip`}
            data-tooltip-content={
              shippingOptions.deliverytype.find((o) => o.label === form.shipping.deliverytype)?.info
            }
            className="absolute right-3 top-3 text-blue-500 cursor-pointer font-bold"
          >
            ?
          </span>
        </div>
      </div>
      
      <Tooltip id="shipsfrom-tooltip" place="top" effect="solid" />
      <Tooltip id="deliverytype-tooltip" place="top" effect="solid" />
    </div>
            </div>
        </motion.div>

        {/* === 6. ATTRIBUTES (GENERIC) === */}
        <motion.div variants={FADE_VARIANTS} initial="hidden" animate="visible" className={`p-8 rounded-3xl border ${MERKOVA_THEME.border} ${MERKOVA_THEME.card}`}>
            <div className="flex items-center gap-3 mb-6 text-blue-300">
                <FileText size={20} /> <h3 className="text-xl font-bold">Detailed Attributes</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {/* Specific attributes can be added here, currently dumping generic ones for "Full Code" aspect */}
                 <InputGroup label="Material" value={form.attributes.material} onChange={(e) => setForm({...form, attributes: {...form.attributes, material: e.target.value}})} />
                 <InputGroup label="Pattern" value={form.attributes.pattern} onChange={(e) => setForm({...form, attributes: {...form.attributes, pattern: e.target.value}})} />
                 <InputGroup label="Style / Fit" value={form.attributes.fit} onChange={(e) => setForm({...form, attributes: {...form.attributes, fit: e.target.value}})} />
                 <InputGroup label="Occasion" value={form.attributes.occasion} onChange={(e) => setForm({...form, attributes: {...form.attributes, occasion: e.target.value}})} />
                 <div className="col-span-2">
                    <InputGroup label="Origin Country" value={form.attributes.countryoforigin} onChange={(e) => setForm({...form, attributes: {...form.attributes, countryoforigin: e.target.value}})} />
                 </div>
                 <div className="col-span-2">
                    <InputGroup label="Safety Info" value={form.attributes.safetyinformation} onChange={(e) => setForm({...form, attributes: {...form.attributes, safetyinformation: e.target.value}})} />
                 </div>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MerkovaCreateItem;