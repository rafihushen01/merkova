import React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  MapPin,
  Star,
  Package,
  ShoppingBag,
  Users
} from "lucide-react";
import { useSelector } from "react-redux";

const SellerShopView = () => {
  const {shopData}=useSelector((s)=>s.shop)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white">

      {/* ================= COVER SECTION ================= */}
      <div className="relative w-full h-[280px]">
        <img
          src={shopData.coverimage}
          alt="cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 " />

        {/* Profile */}
        <div className="absolute bottom-[-50px] left-6 flex items-end gap-4">
          <img
            src={shopData.profileimage}
            alt="profile"
            className="w-[110px] h-[110px] rounded-full border-4 border-black object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{shopData.name}</h1>
            <p className="text-sm text-gray-300">{shopData.storetype}</p>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="pt-20 px-6 max-w-7xl mx-auto">

        {/* ================= BADGES ================= */}
        <div className="flex flex-wrap gap-3 mb-6">
          {shopData.badges?.verifiedcompany && (
            <span className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm cursor-pointer">
              <BadgeCheck size={16} /> Verified
            </span>
          )}
          {shopData.badges?.topbrand && (
            <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm cursor-pointer">
              Top Brand
            </span>
          )}
          {shopData.badges?.bestseller && (
            <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm cursor-pointer">
              Bestseller
            </span>
          )}
        </div>

        {/* ================= STATS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          <Stat icon={<Package />} label="Products"  value={shopData.metrics.totalproducts} />
          <Stat icon={<ShoppingBag />} label="Orders" value={shopData.metrics.totalorders} />
          <Stat icon={<Users />} label="Followers" value={shopData.metrics.totalfollowers} />
          <Stat
            icon={<Star />}
            label="Rating"
            value={shopData.rating.average || 0}
          />
        </motion.div>

        {/* ================= DESCRIPTION ================= */}
        <div className="bg-white/5 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">About This Shop</h2>
          <p className="text-gray-300 leading-relaxed">
            {shopData.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {shopData.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-black/40 rounded-full text-sm cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* ================= ADDRESS ================= */}
        <div className="bg-white/5 rounded-2xl p-6 mb-12">
          <h2 className="text-xl font-semibold mb-3">Shop Location</h2>
          <div className="flex items-start gap-2 text-gray-300">
            <MapPin />
            <p>
              {shopData.address.fulladdress},{" "}
              {shopData.address.city},{" "}
              {shopData.address.district},{" "}
              {shopData.address.division},{" "}
              {shopData.address.country}
            </p>
          </div>

          {/* Map placeholder */}
         
        </div>

        {/* ================= TRUST & FINANCE ================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <InfoCard title="Commission">
            {shopData.finance.commissionpercent}% platform fee
          </InfoCard>

          <InfoCard title="Membership">
            {shopData.membership.plan === "None"
              ? "No active membership"
              : shopData.membership.plan}
          </InfoCard>

          <InfoCard title="Visibility">
            {shopData.visibility ? "Publicly Visible" : "Hidden"}
          </InfoCard>
        </div>

      </div>
    </div>
  );
};

export default SellerShopView;

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ icon, label, value }) => (
  <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 cursor-pointer">
    <div className="text-blue-400">{icon}</div>
    <div>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

const InfoCard = ({ title, children }) => (
  <div className="rounded-xl p-5 cursor-pointer">
    <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
    <p className="text-lg font-semibold">{children}</p>
  </div>
);
