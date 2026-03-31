import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { serverurl } from "../../App";
import { FaPlus, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

/* ================= PREMIUM BACKGROUND ================= */
const PurpleBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#2a003f] via-[#3b0a63] to-[#12001f]">
    {[...Array(30)].map((_, i) => (
      <motion.span
        key={i}
        className="absolute w-2 h-2 bg-purple-400/40 rounded-full blur-sm"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: 0.3,
        }}
        animate={{
          y: ["0%", "100%"],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 15 + Math.random() * 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

/* ================= MAIN PAGE ================= */
const CampaignSuperAdmin = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    title: "",
    navlink: "",
    startdate: "",
    enddate: "",
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [sectionForm, setSectionForm] = useState({
    title: "",
    subtitle: "",
    navlink: "",
    image: null,
  });

  /* ================= FETCH CAMPAIGNS ================= */
  const fetchCampaigns = async () => {
    try {
      const { data } = await axios.get(`${serverurl}/campaign/active`);
      setCampaigns(data.campaigns);
    } catch {
      toast.error("Failed to fetch campaigns");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  /* ================= CREATE CAMPAIGN ================= */
  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    if (!bannerFile) return toast.error("Please upload banner");

    try {
      const formData = new FormData();
      Object.entries(newCampaign).forEach(([k, v]) => formData.append(k, v));
      formData.append("banner", bannerFile);

      await axios.post(`${serverurl}/campaign/admin/campaign`, formData);
      toast.success("Campaign created");
      setNewCampaign({ name: "", title: "", navlink: "", startdate: "", enddate: "" });
      setBannerFile(null);
      fetchCampaigns();
    } catch {
      toast.error("Create failed");
    }
  };

  /* ================= ADD SECTION ================= */
  const handleSectionAdd = async (campaignId) => {
    if (!sectionForm.image) return toast.error("Upload section image");

    try {
      const formData = new FormData();
      Object.entries(sectionForm).forEach(([k, v]) => formData.append(k, v));

      await axios.post(`${serverurl}/campaign/admin/campaign/${campaignId}/section`, formData);
      toast.success("Section added");
      setSectionForm({ title: "", subtitle: "", navlink: "", image: null });
      fetchCampaigns();
    } catch {
      toast.error("Section failed");
    }
  };

  /* ================= DELETE CAMPAIGN ================= */
  const handleCampaignDelete = async (campaignId) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await axios.delete(`${serverurl}/campaign/admin/campaign/${campaignId}`);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="relative min-h-screen p-8 text-white">
      <PurpleBackground />

      {/* ================= HEADER ================= */}
      <motion.h1
        className="text-4xl font-extrabold mb-10 tracking-wide"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Campaign SuperAdmin
      </motion.h1>

      {/* ================= CREATE CAMPAIGN ================= */}
      <motion.form
        onSubmit={handleCampaignSubmit}
        className="mb-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-purple-200">
          Create New Campaign
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {["name", "title", "navlink"].map((field) => (
            <input
              key={field}
              placeholder={field.toUpperCase()}
              value={newCampaign[field]}
              onChange={(e) =>
                setNewCampaign({ ...newCampaign, [field]: e.target.value })
              }
              className="bg-white/10 border border-white/20 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
          <input type="date" className="input" onChange={(e) => setNewCampaign({ ...newCampaign, startdate: e.target.value })} />
          <input type="date" className="input" onChange={(e) => setNewCampaign({ ...newCampaign, enddate: e.target.value })} />
          <input type="file" onChange={(e) => setBannerFile(e.target.files[0])} />
        </div>

        <button className="mt-5 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:scale-105 transition font-semibold">
          Create Campaign
        </button>
      </motion.form>

      {/* ================= CAMPAIGN CARDS ================= */}
      <div className="grid lg:grid-cols-2 gap-8">
        {campaigns.map((camp) => (
          <motion.div
            key={camp._id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl hover:shadow-purple-800/40 transition relative"
            whileHover={{ y: -6 }}
          >
            {/* ================= DELETE BUTTON ================= */}
            <button
              onClick={() => handleCampaignDelete(camp._id)}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 p-2 rounded-full text-white shadow-lg transition transform hover:scale-110"
            >
              <FaTrash />
            </button>

            <img
              src={camp.banner?.url}
              className="h-48 w-full object-cover rounded-xl mb-4"
            />

            <h3 className="text-xl font-bold text-purple-200">{camp.name}</h3>
            <p className="text-gray-300">{camp.title}</p>

            {/* ================= ADD SECTION ================= */}
            <div className="mt-5">
              <h4 className="font-semibold mb-2">Add Section</h4>
              <input
                placeholder="Section Title"
                className="input mb-2"
                onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
              />
              <input
                placeholder="Subtitle"
                className="input mb-2"
                onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
              />
              <input
                placeholder="NavLink"
                className="input mb-2"
                onChange={(e) => setSectionForm({ ...sectionForm, navlink: e.target.value })}
              />
              <input type="file" onChange={(e) => setSectionForm({ ...sectionForm, image: e.target.files[0] })} />

              <button
                onClick={() => handleSectionAdd(camp._id)}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-700 rounded-xl hover:bg-purple-800"
              >
                <FaPlus /> Add Section
              </button>
            </div>

            {/* ================= SECTIONS ================= */}
            {camp.sections?.length > 0 && (
              <div className="mt-5 space-y-2">
                {camp.sections.map((sec, i) => (
                  <div key={i} className="flex gap-3 items-center bg-white/5 p-2 rounded-xl">
                    <img src={sec.image?.url} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{sec.title}</p>
                      <p className="text-xs text-gray-400">{sec.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CampaignSuperAdmin;
