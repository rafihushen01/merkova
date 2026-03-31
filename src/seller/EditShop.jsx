import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { serverurl } from "../App";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { 
  UploadCloud, Loader2, Save, Store, MapPin, 
  CreditCard, Video, Image as ImageIcon, Sparkles, AlertCircle 
} from "lucide-react";

// --- Constants ---
const STORE_TYPES = [
  "SmartPhones", "Electronic & Appliances", "Television", "Washing Machine", 
  "Mobile Accessories", "Computers", "Computers Accessories", "Mens Watches", 
  "Pc Shop", "Laptop Shop", "Womens Watches", "Electronics Vehicles [EV]", 
  "Mens Clothing Shop", "Womens Clothing Shop", "Kids Clothing Shop", 
  "Teens Clothing Shop", "MediCare Shop", "Beauty & Cosmetics Shop", 
  "Fragrance & ATAR Shop", "Muslim Fashion", "Mens Shoes Shop", 
  "Womens Shoes Shop", "Snacks,Chocolate & Groccery Shop", 
  "Panjabi & Muslim Shop", "Lingerie & Undergarments Shop", 
  "Health & Sexual Product Shop", "Toys Shop", "Gym Clothing & Products Shop", 
  "Pet & Pet Food Shop", "Plus Size Fashion", "Book Shop",
];

const CAPACITY = ["Small", "Large", "Big", "Huge", "Company", "Empire"];
const PAYOUT_METHODS = ["Bank", "Bkash", "Nagad", "Rocket"];
const ACCOUNT_TYPES = ["Personal", "Bussiness"];

// --- Animation Variants ---
const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const EditShop = () => {
  const { shopData } = useSelector((state) => state.shop);
  const [loading, setLoading] = useState(false);
  
  // State
  const [formData, setFormData] = useState({
    address: {},
    bank: {},
    tags: [] // Backend expects array or string
  });
  const [previews, setPreviews] = useState({});

  // Initialize Data
  useEffect(() => {
    if (shopData) {
      setFormData({
        ...shopData,
        address: shopData.address || {},
        bank: shopData.bank || {},
        tags: shopData.tags || []
      });
    }
  }, [shopData]);

  // Handle Text Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Nested Objects (Bank/Address) - Backend Friendly
  const handleNestedChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Handle Single File Upload
  const handleFile = (e) => {
    const { name, files } = e.target;
    if (!files[0]) return;

    setFormData((prev) => ({ ...prev, [name]: files[0] }));
    setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(files[0]) }));
  };

  // Handle Gallery (Multiple Files)
  const handleGallery = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, gallery: files })); // Store raw files
      // Create previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews((prev) => ({ ...prev, gallery: newPreviews }));
    }
  };

  // Submit to Backend
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        // 1. Handle Nested Objects (Stringify for Backend Parser)
        if (key === "address" || key === "bank") {
          fd.append(key, JSON.stringify(value));
        } 
        // 2. Handle Arrays (like Gallery or Tags)
        else if (key === "gallery" && Array.isArray(value)) {
          value.forEach((file) => fd.append("gallery", file));
        }
        else if (key === "tags" && Array.isArray(value)) {
           fd.append("tags", value.join(",")); // Send as comma separated string
        }
        // 3. Handle Standard Fields & Single Files
        else if (value !== null && value !== undefined) {
          fd.append(key, value);
        }
      });

      const res = await axios.put(`${serverurl}/shop/editshop`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) toast.success("Merkova Shop updated successfully!");
      else toast.error(res.data.message);
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!shopData) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-950 text-blue-50 selection:bg-cyan-500/30 font-sans pb-20 relative overflow-hidden">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }}} />
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 pt-10 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase">
               Merkova
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-400">
              Edit Shop
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Manage your {shopData?.name} Details</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 md:mt-0 group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            <span>{loading ? "Saving Details..." : "Save Changes"}</span>
          </motion.button>
        </motion.div>

        <motion.div 
          variants={containerVar}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* LEFT COLUMN - MEDIA */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div variants={itemVar} className="glass-card p-6 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ImageIcon className="text-cyan-400" size={20}/> Media Assets
              </h3>
              
              <div className="space-y-4">
                <ImageUpload label="Profile Icon" name="profileimage" current={shopData.profileimage} preview={previews.profileimage} onChange={handleFile} />
                <ImageUpload label="Thumbnail" name="thumbnail" current={shopData.thumbnail} preview={previews.thumbnail} onChange={handleFile} aspect="video" />
                <ImageUpload label="Cover Art" name="coverimage" current={shopData.coverimage} preview={previews.coverimage} onChange={handleFile} aspect="video" />
                
                {/* Video Upload Section */}
                <div className="pt-4 border-t border-white/5">
                   <label className="block text-sm font-medium text-slate-400 mb-2">Shop Intro Video</label>
                   <label className="cursor-pointer group block relative overflow-hidden rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-cyan-500 transition-colors h-32 flex flex-col items-center justify-center">
                      <input type="file" name="video" accept="video/*" hidden onChange={handleFile} />
                      <Video className="text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
                      <span className="text-xs text-slate-500">
                        {previews.video ? "Video Selected" : "Upload Video (MP4/WebM)"}
                      </span>
                   </label>
                </div>
              </div>
            </motion.div>

            {/* Gallery Section */}
            <motion.div variants={itemVar} className="glass-card p-6 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
               <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Gallery</h3>
               <label className="cursor-pointer bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all">
                  <UploadCloud size={18} /> Add Photos
                  <input type="file" name="gallery" multiple hidden onChange={handleGallery} />
               </label>
               {/* Gallery Preview Grid */}
               {previews.gallery && (
                 <div className="grid grid-cols-3 gap-2 mt-4">
                    {previews.gallery.slice(0, 6).map((src, i) => (
                      <img key={i} src={src} alt="New" className="w-full h-16 object-cover rounded-lg border border-white/10" />
                    ))}
                    {previews.gallery.length > 6 && (
                      <div className="w-full h-16 flex items-center justify-center bg-slate-800 rounded-lg text-xs text-slate-400">+{previews.gallery.length - 6}</div>
                    )}
                 </div>
               )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN - FORMS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* General Info */}
            <motion.div variants={itemVar} className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <SectionHeader icon={Store} title="Shop Details" subtitle="Core information about your Merkova store" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Shop Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Merkova Official" fullWidth />
                
                <SelectGroup label="Store Category" name="storetype" value={formData.storetype} onChange={handleChange} options={STORE_TYPES} />

                
                <InputGroup label="Specialty" name="specialfor" value={formData.specialfor} onChange={handleChange} placeholder="e.g. Imported Gadgets" />
                <InputGroup label="Tags (Comma separated)" name="tags" value={Array.isArray(formData.tags) ? formData.tags.join(",") : formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value.split(",")})} placeholder="tech, fast, cheap" />

                <div className="md:col-span-2">
                  <label className="label">Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description || ""} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-700/50 focus:border-cyan-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all min-h-[120px]"
                    placeholder="Tell the world about your business..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Address */}
            <motion.div variants={itemVar} className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <SectionHeader icon={MapPin} title="Shop Address" subtitle="Where your shop is stand" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup label="Address Line" value={formData.address?.addressline} onChange={(e) => handleNestedChange("address", "addressline", e.target.value)} placeholder="Street 42" fullWidth />
                <InputGroup label="City" value={formData.address?.city} onChange={(e) => handleNestedChange("address", "city", e.target.value)} />
                <InputGroup label="State/Province" value={formData.address?.state} onChange={(e) => handleNestedChange("address", "state", e.target.value)} />
                <InputGroup label="Zip Code" value={formData.address?.zipcode} onChange={(e) => handleNestedChange("address", "zipcode", e.target.value)} />
                <InputGroup label="Country" value={formData.address?.country} onChange={(e) => handleNestedChange("address", "country", e.target.value)} />
              </div>
            </motion.div>

            {/* Banking */}
            <motion.div variants={itemVar} className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
              <SectionHeader icon={CreditCard} title="Financials" subtitle="Payout configurations" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <InputGroup label="Account Holder" value={formData.bank?.accountholdername} onChange={(e) => handleNestedChange("bank", "accountholdername", e.target.value)} />
                 <InputGroup label="Bank Name" value={formData.bank?.bankname} onChange={(e) => handleNestedChange("bank", "bankname", e.target.value)} />
                 <InputGroup label="Branch Name" value={formData.bank?.branch} onChange={(e) => handleNestedChange("bank", "branch", e.target.value)} />
                 <InputGroup label="Account Number" value={formData.bank?.accountnumber} onChange={(e) => handleNestedChange("bank", "accountnumber", e.target.value)} />
                 <InputGroup label="Mobile Linked" value={formData.bank?.mobilenumber} onChange={(e) => handleNestedChange("bank", "mobilenumber", e.target.value)} />
                 
                 <div className="space-y-2">
                    <label className="label">Account Type</label>
                    <select className="input-field" value={formData.bank?.AccountType || ""} onChange={(e) => handleNestedChange("bank", "AccountType", e.target.value)}>
                      <option value="" className="bg-slate-900">Select Type</option>
                      {ACCOUNT_TYPES.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                    </select>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="label">Payout Method</label>
                    <select className="input-field" value={formData.bank?.payoutmethod || ""} onChange={(e) => handleNestedChange("bank", "payoutmethod", e.target.value)}>
                      <option value="" className="bg-slate-900">Select Method</option>
                      {PAYOUT_METHODS.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
                    </select>
                 </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .glass-card {
           box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 40px -10px rgba(0, 0, 0, 0.5);
        }
        .label {
          display: block;
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .input-field {
          width: 100%;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #06b6d4;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
          background: rgba(15, 23, 42, 0.9);
        }
      `}</style>
    </div>
  );
};

// --- Sub Components ---

const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <Loader2 className="animate-spin text-cyan-500 w-10 h-10" />
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-8 flex items-start gap-4">
    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/5">
      <Icon className="text-cyan-400" size={24} />
    </div>
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-sm text-slate-400">{subtitle}</p>
    </div>
  </div>
);

const InputGroup = ({ label, name, value, onChange, placeholder, fullWidth }) => (
  <div className={`${fullWidth ? "md:col-span-2" : ""}`}>
    <label className="label">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value || ""} 
      onChange={onChange} 
      className="input-field"
      placeholder={placeholder} 
    />
  </div>
);

const SelectGroup = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="label">{label}</label>
    <select name={name} value={value || ""} onChange={onChange} className="input-field">
      <option value="" className="bg-slate-900">Select Option</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
      ))}
    </select>
  </div>
);

const ImageUpload = ({ label, name, current, preview, onChange, aspect }) => (
  <div>
    <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wide">{label}</label>
    <label className={`
      cursor-pointer group relative block overflow-hidden rounded-xl bg-slate-950 border border-dashed border-slate-700 
      hover:border-cyan-500 transition-all
      ${aspect === 'video' ? 'h-32' : 'h-24'}
    `}>
      <input type="file" name={name} hidden onChange={onChange} accept="image/*" />
      
      {preview || current ? (
        <img 
          src={preview || current} 
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
          alt="Preview"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
          <UploadCloud size={20} className="mb-1 group-hover:text-cyan-400 transition-colors" />
          <span className="text-[10px]">Upload</span>
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <Sparkles className="text-cyan-400" size={16} />
      </div>
    </label>
  </div>
);

export default EditShop;