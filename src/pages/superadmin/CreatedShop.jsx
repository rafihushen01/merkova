import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { serverurl } from "../../App"; // Ensure this path is correct
import { 
  UploadCloud, Loader2, RefreshCcw, Store, User, 
  MapPin, CreditCard, Image as ImageIcon, FileText, CheckCircle 
} from "lucide-react";

// ================= ENUMS =================
const storeTypes = [
  "SmartPhones","Electronic & Appliances","Television","Washing Machine","Mobile Accessories",
  "Computers","Computers Accessories","Mens Watches","Pc Shop","Laptop Shop","Womens Watches",
  "Electronics Vehicles [EV]","Mens Clothing Shop","Womens Clothing Shop","Kids Clothing Shop",
  "Teens Clothing Shop","MediCare Shop","Beauty & Cosmetics Shop","Fragrance & ATAR Shop",
  "Muslim Fashion ","Mens Shoes Shop","Womens Shoes Shop","Snacks,Chocolate & Groccery Shop",
  "Panjabi & Muslim Shop","Lingerie & Undergarments Shop","Laptop Shop",
  "Health & Sexual Product Shop","Toys Shop","Gym Clothing & Products Shop","Pet & Pet Food Shop",
  "Plus Size Fashion","Book Shop"
];
const shopCapacities = ["Small","Large","Big","Huge","Company","Empire"];
const accountTypes = ["Personal","Bussiness"];
const payoutMethods = ["Bank","Bkash","Nagad","Rocket"];

// ================= REUSABLE UI COMPONENTS =================

const GlassInput = ({ label, name, value, onChange, type = "text", ...props }) => (
  <div className="relative group mb-4">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none focus:border-cyan-400 focus:bg-white/10 transition-all peer placeholder-transparent"
      placeholder={label}
      {...props}
    />
    <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-400 peer-[&:not(:placeholder-shown)]:top-1 peer-[&:not(:placeholder-shown)]:text-xs">
      {label}
    </label>
  </div>
);

const GlassSelect = ({ label, name, value, onChange, options }) => (
  <div className="relative group mb-4">
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white outline-none focus:border-cyan-400 focus:bg-white/10 transition-all appearance-none cursor-pointer"
    >
      <option value="" className="bg-slate-900 text-gray-500">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
      ))}
    </select>
    <label className="absolute left-4 top-1 text-cyan-400 text-xs">
      {label}
    </label>
  </div>
);

const FileUploadBox = ({ label, name, onChange, preview, isMultiple = false }) => (
  <div className="relative group">
    <label className="block text-sm text-cyan-300 mb-2 font-medium">{label}</label>
    <div className="relative w-full h-32 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-white/5 transition-all overflow-hidden group-hover:scale-[1.01]">
      <input
        type="file"
        name={name}
        onChange={onChange}
        multiple={isMultiple}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      {preview ? (
        Array.isArray(preview) ? (
          <div className="flex gap-1 overflow-x-auto w-full h-full p-2">
             {preview.map((src, i) => <img key={i} src={src} className="h-full rounded-md object-cover" alt="prev" />)}
          </div>
        ) : (
          <img src={preview} alt="Preview" className="w-full h-full object-contain p-2" />
        )
      ) : (
        <div className="text-center">
          <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-1 group-hover:text-cyan-400 transition-colors" />
          <p className="text-xs text-gray-500">Click or Drag</p>
        </div>
      )}
    </div>
  </div>
);

// ================= MAIN COMPONENT =================
const SuperAdminCreateShop = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({});
  const [files, setFiles] = useState({});

  const [formData, setFormData] = useState({
    shopcode: "", name: "", slug: "", description: "", ShopCapacity: "", storetype: "", specialfor: "", tags: "",
    owner: { name: "", email: "", bussinessemail: "", Alternatemobile: "", mobile: "", Gender: "", Age: "", nidnumber: "", tin: "", bin: "" },
    address: { country: "Bangladesh", division: "", district: "", city: "", area: "", zipcode: "", fulladdress: "", maplocation: { lat: 0, lng: 0 } },
    bank: { accountholdername: "", bankname: "", branch: "", accountnumber: "", mobilenumber: "", AccountType: "Personal", SWIFTCODE: "", BanKLocation: "", payoutmethod: "Bank" },
    finance: { onboardingfee: 500, commissionpercent: 6 }, 
    membership: { plan: "None", startdate: null, enddate: null, isactive: false, price: 0, durationmonths: 0 },
    approvalstatus: "approved", visibility: true
  });

  // --- LOGIC ---
  const generateShopCode = () => {
    const array = new Uint8Array(4);
    window.crypto.getRandomValues(array);
    const code = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    setFormData(prev => ({ ...prev, shopcode: code }));
    toast.success("Shop Code Generated!", { icon: "🚀" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: type === "checkbox" ? checked : value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (!selectedFiles.length) return;
    
    if (name === "gallery") {
      setFiles(prev => ({ ...prev, [name]: Array.from(selectedFiles) }));
      setPreviews(prev => ({ ...prev, [name]: Array.from(selectedFiles).map(f => URL.createObjectURL(f)) }));
    } else {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(selectedFiles[0]) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      const appendFormData = (obj, parentKey = "") => {
        Object.keys(obj).forEach(key => {
          const value = obj[key];
          const formKey = parentKey ? `${parentKey}[${key}]` : key;
          if (value && typeof value === "object" && !(value instanceof File) && !Array.isArray(value)) {
            appendFormData(value, formKey);
          } else if (value !== undefined && value !== null) {
            if (Array.isArray(value)) value.forEach(v => data.append(`${formKey}[]`, v));
            else data.append(formKey, value);
          }
        });
      };
      appendFormData(formData);
      Object.keys(files).forEach(key => {
        if (!files[key]) return;
        if (key === "gallery") files[key].forEach(f => data.append("gallery", f));
        else data.append(key, files[key]);
      });

      const res = await axios.post(`${serverurl}/shop/create`, data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(res.data.message);
      // Optional: Reset form logic here
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  // --- TABS CONFIG ---
  const tabs = [
    { id: "basic", label: "Shop Info", icon: Store },
    { id: "owner", label: "Owner", icon: User },
    { id: "location", label: "Address", icon: MapPin },
    { id: "finance", label: "Bank & Fin", icon: CreditCard },
    { id: "media", label: "Media & Docs", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-black text-white p-4 md:p-10 font-sans selection:bg-cyan-500 selection:text-black">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-7xl mx-auto"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              MERKOVA
            </h1>
            <p className="text-slate-400 tracking-wider text-sm mt-1">SUPER ADMIN PORTAL • CREATE SHOP</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            onClick={generateShopCode}
            className="mt-4 md:mt-0 px-6 py-3 bg-white/5 border border-cyan-500/30 rounded-full flex items-center gap-3 hover:bg-cyan-500/10 transition-all group"
          >
            <RefreshCcw className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-mono text-cyan-300 font-bold">{formData.shopcode || "GENERATE CODE"}</span>
          </motion.button>
        </div>

        {/* GLASS CONTAINER */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[800px]">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="w-full md:w-64 bg-black/20 p-6 flex flex-col gap-2 border-r border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/50" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
              </button>
            ))}
          </div>

          {/* FORM AREA */}
          <div className="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto pb-20">
              <AnimatePresence mode="wait">
                
                {/* === BASIC INFO TAB === */}
                {activeTab === "basic" && (
                  <motion.div key="basic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Store className="text-cyan-400"/> Shop Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <GlassInput label="Shop Name" name="name" value={formData.name} onChange={handleChange} />
                      <GlassInput label="Shop Slug (URL)" name="slug" value={formData.slug} onChange={handleChange} />
                    </div>
                    <GlassInput label="Description" name="description" value={formData.description} onChange={handleChange} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <GlassSelect label="Capacity" name="ShopCapacity" value={formData.ShopCapacity} onChange={handleChange} options={shopCapacities} />
                      <GlassSelect label="Store Type" name="storetype" value={formData.storetype} onChange={handleChange} options={storeTypes} />
                    </div>
                    <GlassInput label="Special For" name="specialfor" value={formData.specialfor} onChange={handleChange} />
                    <GlassInput label="Tags (comma separated)" name="tags" value={formData.tags} onChange={handleChange} />
                  </motion.div>
                )}

                {/* === OWNER INFO TAB === */}
                {activeTab === "owner" && (
                  <motion.div key="owner" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><User className="text-cyan-400"/> Owner Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <GlassInput label="Full Name" name="owner.name" value={formData.owner.name} onChange={handleChange} />
                      <GlassInput label="Email" name="owner.email" type="email" value={formData.owner.email} onChange={handleChange} />
                      <GlassInput label="Business Email" name="owner.bussinessemail" value={formData.owner.bussinessemail} onChange={handleChange} />
                      <GlassInput label="Mobile" name="owner.mobile" value={formData.owner.mobile} onChange={handleChange} />
                      <GlassInput label="Alt Mobile" name="owner.Alternatemobile" value={formData.owner.Alternatemobile} onChange={handleChange} />
                      <GlassSelect label="Gender" name="owner.Gender" value={formData.owner.Gender} onChange={handleChange} options={["Male","Female","Other"]} />
                      <GlassInput label="Age" name="owner.Age" value={formData.owner.Age} onChange={handleChange} />
                      <GlassInput label="NID Number" name="owner.nidnumber" value={formData.owner.nidnumber} onChange={handleChange} />
                    </div>
                  </motion.div>
                )}

                {/* === LOCATION TAB === */}
                {activeTab === "location" && (
                  <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><MapPin className="text-cyan-400"/> Address & Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <GlassInput label="Country" name="address.country" value={formData.address.country} onChange={handleChange} />
                      <GlassInput label="Division" name="address.division" value={formData.address.division} onChange={handleChange} />
                      <GlassInput label="District" name="address.district" value={formData.address.district} onChange={handleChange} />
                      <GlassInput label="City" name="address.city" value={formData.address.city} onChange={handleChange} />
                      <GlassInput label="Area" name="address.area" value={formData.address.area} onChange={handleChange} />
                      <GlassInput label="Zip Code" name="address.zipcode" value={formData.address.zipcode} onChange={handleChange} />
                    </div>
                    <GlassInput label="Full Address" name="address.fulladdress" value={formData.address.fulladdress} onChange={handleChange} />
                  </motion.div>
                )}

                {/* === BANK & FINANCE TAB === */}
                {activeTab === "finance" && (
                  <motion.div key="finance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><CreditCard className="text-cyan-400"/> Financial Details</h2>
                    
                    <div className="p-4 rounded-xl bg-blue-900/20 border border-blue-500/30 mb-6">
                        <h3 className="text-sm text-cyan-300 font-bold mb-3 uppercase tracking-wider">Configuration</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <GlassInput label="Onboarding Fee" name="finance.onboardingfee" type="number" value={formData.finance.onboardingfee} onChange={handleChange} />
                            <GlassInput label="Commission %" name="finance.commissionpercent" type="number" value={formData.finance.commissionpercent} onChange={handleChange} />
                            <GlassInput label="TIN" name="owner.tin" value={formData.owner.tin} onChange={handleChange} />
                            <GlassInput label="BIN" name="owner.bin" value={formData.owner.bin} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <GlassInput label="Account Holder" name="bank.accountholdername" value={formData.bank.accountholdername} onChange={handleChange} />
                      <GlassInput label="Bank Name" name="bank.bankname" value={formData.bank.bankname} onChange={handleChange} />
                      <GlassInput label="Branch" name="bank.branch" value={formData.bank.branch} onChange={handleChange} />
                      <GlassInput label="Account Number" name="bank.accountnumber" value={formData.bank.accountnumber} onChange={handleChange} />
                      <GlassInput label="Bank Mobile" name="bank.mobilenumber" value={formData.bank.mobilenumber} onChange={handleChange} />
                      <GlassInput label="Swift Code" name="bank.SWIFTCODE" value={formData.bank.SWIFTCODE} onChange={handleChange} />
                      <GlassSelect label="Account Type" name="bank.AccountType" value={formData.bank.AccountType} onChange={handleChange} options={accountTypes} />
                      <GlassSelect label="Payout Method" name="bank.payoutmethod" value={formData.bank.payoutmethod} onChange={handleChange} options={payoutMethods} />
                    </div>
                  </motion.div>
                )}

                {/* === MEDIA & DOCS TAB === */}
                {activeTab === "media" && (
                  <motion.div key="media" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><FileText className="text-cyan-400"/> Legal & Media</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {/* Shop Branding */}
                       <div className="col-span-full border-b border-white/10 pb-4 mb-2"><h3 className="text-white font-bold">Shop Branding</h3></div>
                       <FileUploadBox label="Profile Image" name="profileimage" onChange={handleFileChange} preview={previews.profileimage} />
                       <FileUploadBox label="Cover Image" name="coverimage" onChange={handleFileChange} preview={previews.coverimage} />
                       <FileUploadBox label="Thumbnail" name="thumbnail" onChange={handleFileChange} preview={previews.thumbnail} />
                       <FileUploadBox label="Gallery (Multiple)" name="gallery" onChange={handleFileChange} preview={previews.gallery} isMultiple />
                       
                       {/* Legal Docs */}
                       <div className="col-span-full border-b border-white/10 pb-4 mb-2 mt-4"><h3 className="text-white font-bold">Verification Documents</h3></div>
                       <FileUploadBox label="NID Card" name="nid" onChange={handleFileChange} preview={previews.nid} />
                       <FileUploadBox label="Trade License" name="tradelicense" onChange={handleFileChange} preview={previews.tradelicense} />
                       <FileUploadBox label="Birth Certificate" name="birthcertificate" onChange={handleFileChange} preview={previews.birthcertificate} />
                       <FileUploadBox label="Physical Store Img" name="physicalstoreimage" onChange={handleFileChange} preview={previews.physicalstoreimage} />
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* ACTION BAR */}
              <div className="fixed bottom-0 left-0 md:left-64 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/10 flex justify-end items-center gap-4 z-50">
                <p className="text-xs text-gray-500 hidden md:block">By clicking create, you agree to Merkova Terms.</p>
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-3 rounded-xl font-bold text-lg shadow-lg shadow-cyan-900/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin w-6 h-6"/> : <><CheckCircle className="w-5 h-5"/> Create Merkova Shop</>}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminCreateShop;