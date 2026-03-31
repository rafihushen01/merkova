import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { 
  Edit3, RefreshCcw, Search, Package, ShieldCheck, Globe, Truck, Ruler, Scale, 
  Tag, Layers, Cpu, Eye, Info, Activity, Image as ImageIcon,
  Video, Star, ShoppingCart, Heart, BarChart3, AlertTriangle,
  FileBadge, MapPin, Clock, DollarSign, Fingerprint, Box, Zap
} from "lucide-react";
import { useSelector } from "react-redux";
import { serverurl } from "../App.jsx";
import { useNavigate } from "react-router-dom";

const Allitem = () => {
  const { shopData } = useSelector(state => state.shop);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchitems = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${serverurl}/item/myshop`, { shopid: shopData?._id }, { withCredentials: true });
      if (res.data?.success) setItems(res.data.items || []);
    } catch (error) {
      toast.error("Merkova Neural Link: Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (shopData?._id) fetchitems(); }, [shopData]);

  const filtereditems = items.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.itemid?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#020617] text-blue-50 font-sans p-4 xl:p-10 selection:bg-blue-500 overflow-x-hidden">
      <Toaster position="top-right" />
      
      {/* BACKGROUND ENERGY GRID */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 max-w-[1900px] mx-auto">
        
        {/* MERKOVA COMMAND CENTER HEADER */}
        <header className="flex flex-col xl:flex-row justify-between items-center gap-8 mb-20 border-b border-blue-900/50 pb-10">
          <motion.div initial={{ x: -100 }} animate={{ x: 0 }}>
            <h1 className="text-8xl font-black tracking-tighter text-white italic drop-shadow-[0_0_30px_rgba(37,99,235,0.5)]">
              MERKOVA <span className="text-blue-600 not-italic">Items Hub</span>
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="h-[2px] w-20 bg-blue-600" />
              <p className="text-blue-400 font-mono text-xs tracking-[0.5em] uppercase">{shopData?.name}  Shop All Items</p>
            </div>
          </motion.div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[500px] group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:text-white transition-all" size={24} />
              <input 
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Searching Items..."
                className="w-full pl-16 pr-8 py-6 rounded-full bg-blue-950/30 border border-blue-500/30 focus:border-blue-400 focus:bg-blue-900/40 outline-none backdrop-blur-xl transition-all font-mono text-lg shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]"
              />
            </div>
            <button onClick={fetchitems} className="px-12 py-6 bg-blue-600 hover:bg-blue-500 rounded-full font-black flex items-center gap-3 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 text-white">
              <RefreshCcw size={24} className={loading ? "animate-spin" : ""} /> Refresh 
            </button>
          </div>
        </header>

        {/* THE NEURAL GRID */}
        <div className="grid grid-cols-1 gap-16">
          {filtereditems.map((item, idx) => (
            <motion.div 
              key={item._id} 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group bg-gradient-to-br from-blue-950/20 to-black/40 border border-blue-500/10 rounded-[4rem] p-1 overflow-hidden hover:border-blue-500/40 transition-all duration-500 shadow-3xl"
            >
              <div className="absolute top-0 right-20 px-10 py-3 bg-blue-600 text-[10px] font-black italic rounded-b-3xl shadow-2xl z-20">
                Item_ID: {item.itemid}
              </div>

              <div className="flex flex-col lg:flex-row min-h-[800px]">
                
                {/* 1. LEFT PANEL: ANALYTICS & LOGISTICS */}
                <aside className="lg:w-80 bg-blue-900/10 backdrop-blur-md p-10 border-r border-blue-500/10 flex flex-col gap-12">
                  <section>
                    <h4 className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-6 flex items-center gap-2">
                      <Activity size={14}/> Live Metrics
                    </h4>
                    <div className="space-y-4">
                      <MetricItem icon={<Eye/>} label="Total Views" val={item.metrics?.totalviews} color="text-blue-400" />
                      <MetricItem icon={<ShoppingCart/>} label="Total Sold" val={item.metrics?.totalsold} color="text-emerald-400" />
                      <MetricItem icon={<Heart/>} label="Total Wishlists" val={item.metrics?.wishlistcount} color="text-rose-400" />
                      <MetricItem icon={<Star/>} label="User Rating" val={`${item.rating}/5`} color="text-amber-400" />
                    </div>
                  </section>

                  <section className="pt-10 border-t border-blue-500/10">
                    <h4 className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-6 flex items-center gap-2">
                      <Truck size={14}/> Logistics
                    </h4>
                    <div className="space-y-4">
                      <LogiDetail icon={<Scale/>} label="Weight" val={item.shipping?.weight} />
                      <LogiDetail icon={<Ruler/>} label="Dims" val={`${item.shipping?.dimensions?.length}x${item.shipping?.dimensions?.width}`} />
                      <LogiDetail icon={<Clock/>} label="SLA" val={`${item.shipping?.handlingtime} Days`} />
                      <LogiDetail icon={<Globe/>} label="Origin" val={item.attributes?.countryoforigin} />
                      <LogiDetail icon={<ShieldCheck/>} label="Dangerous" val={item.shipping?.isdangerous ? "TRUE" : "FALSE"} />
                    </div>
                  </section>
                </aside>

                {/* 2. CENTER PANEL: THE DATA CORE */}
                <main className="flex-1 p-10 lg:p-16 overflow-hidden">
                  {/* Identity */}
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/30">SLUG: {item.slug}</span>
                      <span className="bg-white/5 text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full border border-white/10">BRAND: {item.brand}</span>
                    </div>
                    <h2 className="text-6xl font-black text-white leading-tight uppercase tracking-tighter mb-4">{item.title}</h2>

                  </div>

                  {/* Comprehensive Media Engine - TAKES ALL IMAGES & VIDEOS */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-white flex items-center gap-3 tracking-widest uppercase border-l-4 border-blue-600 pl-4">
                        <ImageIcon size={18} className="text-blue-500"/>  Media Assets
                      </h4>
                      <div className="grid grid-cols-4 gap-4">
                        {/* Primary Images */}
                        {item.media?.images?.map((img, i) => (
                          <MediaCard key={`p-${i}`} url={img.url} type="PRIMARY" primary={img.isprimary} />
                        ))}
                        {/* Color Variant Images - EXPLICITLY FETCHED */}
                        {item.colorvariants?.map((cv) => 
                          cv.images?.map((img, i) => (
                            <MediaCard key={`cv-${cv.colorname}-${i}`} url={img.url} type={cv.colorname} />
                          ))
                        )}
                        {/* Brand Media */}
                        {item.brandmedia?.map((bm) => 
                          bm.images?.map((img, i) => (
                            <MediaCard key={`bm-${i}`} url={img.url} type="BRAND" />
                          ))
                        )}
                      </div>
                      
                      {/* Video Stream Section */}
                      <div className="flex gap-4">
                        {item.media?.videos?.map((vid, i) => (
                          <div key={i} className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 p-3 rounded-xl text-[10px] font-black">
                            <Video size={14} className="text-blue-400"/> VIDEO_STREAM_{i+1}.MP4
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-xl">
                      <div className="mb-8">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Item Description</h4>
                        <p className="text-gray-300 leading-relaxed text-sm font-medium">{item.description}</p>
                      </div>
                      <div className="p-6 bg-blue-600/10 rounded-2xl border-l-4 border-blue-600 mb-8">
                        <h4 className="text-[10px] font-black text-blue-400 uppercase mb-2">Item Highlights</h4>
                        <p className="text-xs italic text-blue-100 italic leading-relaxed">"{item.highlights}"</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <AttributeBox label="Material" val={item.attributes?.material} />
                        <AttributeBox label="Warranty" val={item.warranty} />
                        <AttributeBox label="Pattern" val={item.attributes?.pattern} />
                        <AttributeBox label="Occasion" val={item.attributes?.occasion} />
                      </div>
                    </div>
                  </div>

                  {/* Variant & Pricing Table - 100% TRANSPARENCY */}
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-3 tracking-[0.4em] uppercase mb-8">
                      <BarChart3 size={18} className="text-blue-500"/> Stock & Pricing Matrix
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {item.colorvariants?.map((cv, vIdx) => (
                        <div key={vIdx} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 group/var hover:bg-blue-600/5 transition-all">
                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full border-4 border-white/10 shadow-2xl" style={{ backgroundColor: cv.colorhex }} />
                              <span className="font-black text-2xl tracking-tighter text-white uppercase">{cv.colorname}</span>
                            </div>
                            <StatusBadge active={cv.isactive} />
                          </div>

                          <div className="space-y-4">
                            {cv.sizes?.map((size, sIdx) => (
                              <div key={sIdx} className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-blue-500/40 transition-all group/size">
                                <div>
                                  <div className="text-white font-black text-xl">{size.label || "STD"}</div>
                                  <div className="text-[10px] text-blue-500 font-bold uppercase mt-1 flex items-center gap-2">
                                    <Box size={10}/> Qty: {size.quantity}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-blue-400 font-black text-2xl flex items-center gap-1 justify-end">
                                    <span className="text-sm opacity-50">{size.price?.currency}</span> {size.price?.currentprice}
                                  </div>
                                  <div className="text-[10px] text-gray-500 font-bold line-through">BASE: {size.price?.baseprice}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </main>

                {/* 3. RIGHT PANEL: ACTION COMMANDS */}
                <aside className="lg:w-12 bg-blue-600 flex lg:flex-col items-center justify-center p-8 gap-10">
                  <ActionTrigger icon={<Edit3 size={32}/>} label="EDIT" onClick={() => navigate(`/seller/edititem/${item._id}`)} />
                 
                 
                </aside>

              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FOOTER STATS */}
      <footer className="mt-20 border-t border-blue-900/50 py-10 text-center">
        <p className="text-blue-500 font-mono text-[10px] tracking-widest uppercase">
         © {new Date().getFullYear()} All Copyright Are Reserved By Merkova
        </p>
      </footer>
    </div>
  );
};

// UI COMPONENT LIBRARY
const MetricItem = ({ icon, label, val, color }) => (
  <div className="bg-black/40 p-5 rounded-2xl border border-white/5 group hover:bg-blue-600/10 transition-all">
    <div className={`mb-3 ${color}`}>{React.cloneElement(icon, { size: 20 })}</div>
    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{label}</p>
    <p className="text-xl font-black text-white">{val ?? 0}</p>
  </div>
);

const LogiDetail = ({ icon, label, val }) => (
  <div className="flex items-center justify-between text-[11px] group">
    <div className="flex items-center gap-2 text-gray-500 group-hover:text-blue-400 transition-colors">
      {React.cloneElement(icon, { size: 14 })} <span className="font-bold uppercase tracking-tight">{label}</span>
    </div>
    <span className="text-white font-mono font-bold">{val || "NULL"}</span>
  </div>
);

const MediaCard = ({ url, type, primary }) => (
  <motion.div whileHover={{ scale: 1.1, zIndex: 50 }} className={`aspect-square rounded-2xl overflow-hidden border-2 bg-black relative group/media ${primary ? 'border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'border-white/10'}`}>
    <img src={url} className="w-full h-full object-cover" alt="asset" />
    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1 text-[8px] font-black text-center text-blue-400 uppercase">
      {type}
    </div>
  </motion.div>
);

const AttributeBox = ({ label, val }) => (
  <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-blue-500/20 transition-all">
    <p className="text-[9px] text-blue-500 font-black uppercase mb-1">{label}</p>
    <p className="text-xs text-white font-bold truncate uppercase">{val || "NONE"}</p>
  </div>
);

const StatusBadge = ({ active }) => (
  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
    {active ? "NETWORK_ONLINE" : "OFFLINE"}
  </div>
);

const ActionTrigger = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 text-white/50 hover:text-white transition-all transform hover:scale-125 active:scale-90 group"
  >
    <div className="p-3 rounded-2xl group-hover:bg-white/10 transition-all">
      {icon}
    </div>
    <span className="text-[10px] font-black tracking-widest">{label}</span>
  </button>
);

export default Allitem;