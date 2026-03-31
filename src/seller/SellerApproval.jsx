import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Loader2,
  UploadCloud,
  User,
  Store,
  FileText,
  Link2,
  Landmark,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
 
} from "lucide-react";
import { serverurl } from "../App";

// ================= EXAMPLE IMAGES =================
import nidfrontexample from "../assets/Nidfrontpart.jpg";
import nidbackexample from "../assets/Nid backpartimage.png";
import birthcertexample from "../assets/Bdbirthcetificate.jpg";
import bankcheckexample from "../assets/Bank check.jpg";

// ================= MERKOVA PREMIUM BACKGROUND =================
const MerkovaBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-purple-900" />
    <div className="absolute w-[700px] h-[700px] bg-purple-600/20 blur-[160px] rounded-full top-[-300px] left-[-300px]" />
    <div className="absolute w-[700px] h-[700px] bg-indigo-600/20 blur-[160px] rounded-full bottom-[-300px] right-[-300px]" />
    <div className="absolute inset-0">
      {/* {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-400 animate-bounce"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 3}s`,
          }}
        />
      ))} */}
    </div>
  </div>
);

const SellerApproval = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    storetype: "",
    storeaddress: "",
    owner: {
      name: "",
      email: "",
      businessEmail: "",
      mobile: "",
      alternateMobile: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      nidNumber: "",
      tradelicensenumber: "",
      BikashMerchantNumber: "",
      bankDetails: {
        accountNumber: "",
        bankName: "",
        branch: "",
        BankCode: ""
      },
      socialLinks: {
        instagram: "",
        facebook: "",
        linkedin: "",
    
        website: ""
      }
    },
    specialcategories: {}
  });

  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("owner.")) {
      const keys = name.split(".");
      setFormData(prev => {
        const owner = { ...prev.owner };
        if (keys.length === 2) owner[keys[1]] = value;
        if (keys.length === 3)
          owner[keys[1]] = { ...owner[keys[1]], [keys[2]]: value };
        return { ...prev, owner };
      });
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ================= FILE HANDLER =================
  const handleFileChange = (e) => {
    const { name, files: f } = e.target;
    if (!f || !f.length) return;
    if (f.length > 1) {
      setFiles(prev => ({ ...prev, [name]: Array.from(f) }));
      setPreviews(prev => ({ ...prev, [name]: Array.from(f).map(x => URL.createObjectURL(x)) }));
    } else {
      setFiles(prev => ({ ...prev, [name]: f[0] }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(f[0]) }));
    }
  };

  // ================= DOB VALIDATION =================
  const isAdult = (dob) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) return age - 1 >= 18;
    return age >= 18;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredOwnerFiles = ["nidfrontimage", "birthCertificateImage"];
    for (let f of requiredOwnerFiles) {
      if (!files[f]) return toast.error(`Please upload ${f}`);
    }
    if (!formData.owner.gender) return toast.error("Please select gender");
    if (!formData.name || !formData.storetype) return toast.error("Shop name & store type are required");
    if (!formData.owner.dateOfBirth || !isAdult(formData.owner.dateOfBirth))
      return toast.error("Owner must be 18+ years old");

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("storetype", formData.storetype);
      data.append("storeaddress", formData.storeaddress);
      data.append("owner", JSON.stringify(formData.owner));
      data.append("specialcategories", JSON.stringify(formData.specialcategories));

      Object.keys(files).forEach(key => {
        if (Array.isArray(files[key])) files[key].forEach(f => data.append(key, f));
        else data.append(key, files[key]);
      });

      const res = await axios.post(`${serverurl}/shoprequest/create`, data);

      if (res.data.success) {
        toast.success("🚀 Shop request submitted successfully. Awaiting Merkova verification.", { duration: 6000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-20 px-6">
      <MerkovaBackground />
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
      >
        <h1 className="text-5xl font-extrabold text-center text-white mb-14">
          Merkova Seller Shop Approval
        </h1>

        <form onSubmit={handleSubmit} className="space-y-16">

          {/* ========== SHOP INFO ========== */}
          <Section title="Shop Information" icon={<Store />}>
            <Input name="name" placeholder="Shop Name" required onChange={handleChange} />
            <Input name="description" placeholder="Shop Description" onChange={handleChange} />
            <Input name="storeaddress" placeholder="Full Shop Address" onChange={handleChange} />
            <Select name="storetype" onChange={handleChange} />
          </Section>

          {/* ========== OWNER INFO ========== */}
          <Section title="Owner Identity" icon={<User />}>
            <Input name="owner.name" placeholder="Owner Name" required onChange={handleChange} />
            <Input name="owner.email" placeholder="Personal Email" onChange={handleChange} />
            <Input name="owner.businessEmail" placeholder="Business Email" onChange={handleChange} />
            <Input name="owner.mobile" placeholder="Mobile Number" onChange={handleChange} />
            <Input name="owner.alternateMobile" placeholder="Alternate Mobile" onChange={handleChange} />
            <Input type="date" name="owner.dateOfBirth" onChange={handleChange} />
            <Select name="owner.gender" onChange={handleChange} options={["Male", "Female"]} placeholder="Select Gender" />
            <Input name="owner.nationality" placeholder="Nationality" onChange={handleChange} />
            <Input name="owner.nidNumber" placeholder="NID Number" onChange={handleChange} />
            <Input name="owner.tradelicensenumber" placeholder="Trade License Number" onChange={handleChange} />
            <Input name="owner.BikashMerchantNumber" placeholder="Bkash Merchant Number" onChange={handleChange} />
          </Section>

          {/* ========== SOCIAL LINKS ========== */}
          <Section title="Social Links"   icon={<Link2 />}>
            <Input icon={<Instagram />} name="owner.socialLinks.instagram" placeholder="Instagram URL" onChange={handleChange} />
            <Input icon={<Facebook />} name="owner.socialLinks.facebook" placeholder="Facebook URL" onChange={handleChange} />
            <Input icon={<Linkedin />} name="owner.socialLinks.linkedin" placeholder="LinkedIn URL" onChange={handleChange} />

            <Input icon={<Globe />} name="owner.socialLinks.website" placeholder="Website URL" onChange={handleChange} />
          </Section>

          {/* ========== BANK DETAILS ========== */}
          <Section title="Bank Details" icon={<Landmark />}>
            <Input name="owner.bankDetails.accountNumber" placeholder="Account Number" onChange={handleChange} />
            <Input name="owner.bankDetails.bankName" placeholder="Bank Name" onChange={handleChange} />
            <Input name="owner.bankDetails.branch" placeholder="Branch" onChange={handleChange} />
            <Input name="owner.bankDetails.BankCode" placeholder="Bank Code" onChange={handleChange} />
          </Section>

          {/* ========== DOCUMENTS ========== */}
          <Section title="Verification Documents" icon={<FileText />}>
            <FileBox name="nidfrontimage" label="NID Front Image" example={nidfrontexample} onChange={handleFileChange} preview={previews} />
            <FileBox name="nidbackimage" label="NID Back Image" example={nidbackexample} onChange={handleFileChange} preview={previews} />
            <FileBox name="birthCertificateImage" label="Birth Certificate" example={birthcertexample} onChange={handleFileChange} preview={previews} />
            <FileBox name="bankcheckbookimage" label="Bank Check Book" example={bankcheckexample} onChange={handleFileChange} preview={previews} />
            <FileBox name="profileImage" label="Profile Image" onChange={handleFileChange} preview={previews} />
            <FileBox name="shopThumbnail" label="Shop Thumbnail" onChange={handleFileChange} preview={previews} />
            <FileBox name="physicalStoreImage" label="Physical Store Image" onChange={handleFileChange} preview={previews} />
            <FileBox name="additionalDocuments" label="Additional Documents" multiple onChange={handleFileChange} preview={previews} />
          </Section>

          {/* ========== SUBMIT BUTTON ========== */}
          <button disabled={loading} className="submitbtn font-bold text-white">
            {loading ? <Loader2 className="animate-spin" /> : <><UploadCloud /> Submit for Verification</>}
          </button>
        </form>
      </motion.div>

      <style>{`
        .input{padding:16px;border-radius:16px;background:rgba(255,255,255,0.95);border:2px solid #c084fc;font-weight:600}
        .submitbtn{cursor-pointer flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 transition-all text-white px-12 py-5 rounded-2xl text-xl font-extrabold mx-auto shadow-xl}
      `}</style>
    </div>
  );
};

// ================= UI PARTS =================
const Section = ({ title, icon, children }) => (
  <section className="space-y-8">
    <h2 className="flex items-center gap-3 text-3xl font-bold text-purple-300">{icon} {title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
  </section>
);

const Input = ({ icon, ...props }) => (
  <div className="relative">
    {icon && <div className="absolute top-1/2 -translate-y-1/2 left-3 text-purple-500">{icon}</div>}
    <input {...props} className={`input ${icon ? "pl-12" : ""}`} />
  </div>
);

const Select = ({ options = [], placeholder = "Select Option", ...props }) => (
  <select {...props} className="input">
    <option value="">{placeholder}</option>
    {options.length
      ? options.map((o, i) => <option key={i} value={o}>{o}</option>)
      : <>
     <option value="">Select Store Type</option>
    <option value="SmartPhones">SmartPhones</option>
    <option value="Electronic & Appliances">Electronic & Appliances</option>
    <option value="Television">Television</option>
    <option value="Washing Machine">Washing Machine</option>
    <option value="Mobile Accessories">Mobile Accessories</option>
    <option value="Computers">Computers</option>
    <option value="Computers Accessories">Computers Accessories</option>
    <option value="Mens Watches">Mens Watches</option>
    <option value="Womens Watches">Womens Watches</option>
    <option value="Electronics Vehicles [EV]">Electronics Vehicles [EV]</option>
    <option value="Mens Clothing Shop">Mens Clothing Shop</option>
    <option value="Womens Clothing Shop">Womens Clothing Shop</option>
    <option value="Kids Clothing Shop">Kids Clothing Shop</option>
    <option value="Teens Clothing Shop">Teens Clothing Shop</option>
    <option value="MediCare Shop">MediCare Shop</option>
    <option value="Beauty & Cosmetics Shop">Beauty & Cosmetics Shop</option>
    <option value="Lingerie & Undergarments Shop">Lingerie & Undergarments Shop</option>
    <option value="Laptop Shop">Laptop Shop</option>

      </>}
  </select>
);

const FileBox = ({ name, label, example, onChange, preview, multiple }) => (
  <div className="space-y-3">
    <label className="filebox font-bold text-white">
      {label}
      <input type="file" name={name} multiple={multiple} hidden onChange={onChange} />
    </label>

    {example && (
      <div>
        <p className="text-sm text-purple-200 mb-1">Example</p>
        <img src={example} className="rounded-xl h-36 object-cover" />
      </div>
    )}

    {preview[name] && (
      Array.isArray(preview[name])
        ? <div className="flex gap-2">{preview[name].map((p, i) => <img key={i} src={p} className="h-28 rounded-xl" />)}</div>
        : <img src={preview[name]} className="h-36 rounded-xl" />
    )}

    <style>{`
      .filebox{cursor-pointer font-bold text-white flex justify-between items-center px-6 py-4 rounded-2xl bg-white/95 border-2 border-dashed border-purple-400 font-bold}
    `}</style>
  </div>
);

export default SellerApproval;
