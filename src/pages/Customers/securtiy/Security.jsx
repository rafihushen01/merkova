import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  RefreshCcw,
  BadgeCheck,
  Wallet,
  Headphones,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    title: "Buyer Protection Guarantee",
    desc: "Every order on Merkova is protected. Secure payments, verified sellers, and guaranteed refunds if anything goes wrong.",
  },
  {
    icon: <Truck className="w-10 h-10" />,
    title: "Fast & Reliable Delivery",
    desc: "Nationwide & global logistics with real‑time tracking, smart routing, and priority delivery options.",
  },
  {
    icon: <RefreshCcw className="w-10 h-10" />,
    title: "Easy Returns",
    desc: "Changed your mind? No worries. Hassle‑free returns with instant status updates and fast refunds.",
  },
  {
    icon: <BadgeCheck className="w-10 h-10" />,
    title: "Verified Sellers Only",
    desc: "Every seller passes Merkova’s multi‑layer verification system before going live on the platform.",
  },
  {
    icon: <Wallet className="w-10 h-10" />,
    title: "Best Price, Smart Savings",
    desc: "Dynamic pricing, flash deals, memberships, and exclusive offers powered by Merkova AI.",
  },
  {
    icon: <Headphones className="w-10 h-10" />,
    title: "24/7 Premium Support",
    desc: "Dedicated human + AI support via chat, email, and calls — always available for you.",
  },
  {
    icon: <Lock className="w-10 h-10" />,
    title: "Bank‑Level Security",
    desc: "Enterprise‑grade encryption, fraud detection, and OTP‑secured accounts protect your data.",
  },
  {
    icon: <Globe className="w-10 h-10" />,
    title: "One‑Stop Global Marketplace",
    desc: "Millions of products across categories — fashion, electronics, home, beauty & more.",
  },
];

const WhyChooseMerkova = () => {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0b1020] via-[#111a3a] to-[#0b1020] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Why Choose <span className="text-blue-500">Merkova</span>?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-300 max-w-3xl mx-auto text-lg"
        >
          Merkova is not just an e‑commerce platform — it’s a next‑generation, trillion‑dollar‑grade marketplace built for trust, speed, and scale.
        </motion.p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-blue-500/10 text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Trust Section */}
      <div className="border-t border-white/10 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          {["Millions of Happy Customers", "Secure Payments Worldwide", "Trusted by Global Sellers"].map(
            (text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <Sparkles className="w-8 h-8 text-blue-500 mb-3" />
                <p className="text-lg font-medium">{text}</p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseMerkova;
