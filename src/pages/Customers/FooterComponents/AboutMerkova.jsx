import React from "react";
import { motion } from "framer-motion";
import Logo from "../../../assets/Logo.png";
import {
  ShieldCheck,
  Truck,
  Globe,
  Users,
  BadgeCheck,
  HeartHandshake,
} from "lucide-react";

const AboutMerkova = () => {
  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      {/* HEADER STRIP (TEMU STYLE FEEL) */}
      <div className="w-full bg-black text-white text-sm flex flex-wrap items-center justify-between px-6 py-2">
        <div className="flex gap-6">
          <span className="text-green-400">Free shipping • Special for you</span>
          <span>Verified sellers only</span>
          <span>Bank‑level security</span>
        </div>
        <div className="flex gap-4">
          <span>Support</span>
          <span>English</span>
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <img src={Logo} alt="Merkova Logo" className="h-16" />
          <h1 className="text-4xl md:text-5xl font-bold text-[#1e40af]">What is Merkova?</h1>
          <p className="max-w-3xl text-lg text-gray-600 leading-relaxed">
            Merkova is a next‑generation Bangladeshi e‑commerce ecosystem built with a single
            mission: to create a trusted, transparent, and fraud‑free digital marketplace.
            We connect verified sellers, manufacturers, and brands directly with customers,
            eliminating fake products, fake sellers, and wasted money.
          </p>
        </motion.div>
      </section>

      {/* WHAT MERKOVA STANDS FOR */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-[#1e40af] mb-10">What does Merkova mean?</h2>
        <p className="text-center max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed">
          Merkova represents reliability, verification, and value. Every product listed on
          Merkova passes through a strict multi‑layer seller verification and quality review
          process. Our platform is designed to protect customers from scams while empowering
          genuine sellers to grow at scale.
        </p>
      </section>

      {/* SHIPPING & LOGISTICS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-[#1e40af] mb-10">
          Where do Merkova products ship from?
        </h2>
        <p className="text-center max-w-4xl mx-auto text-gray-600 text-lg leading-relaxed">
          Products sold on Merkova are shipped through trusted and audited logistics partners.
          Shipping origins vary depending on the seller and product category, but every order
          is monitored end‑to‑end to ensure authenticity, delivery accuracy, and customer
          satisfaction.
        </p>
      </section>

      {/* STRENGTHS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#1e40af] mb-12">Merkova’s strengths</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <ShieldCheck className="text-blue-600 mb-4" size={36} />
              <h3 className="font-semibold text-xl mb-2">Seller verification</h3>
              <p className="text-gray-600">
                Sellers are verified multiple times using legal, financial, and operational
                checks before and after onboarding.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <Truck className="text-blue-600 mb-4" size={36} />
              <h3 className="font-semibold text-xl mb-2">Reliable logistics</h3>
              <p className="text-gray-600">
                Deep collaboration with professional supply chains ensures fast, trackable,
                and secure deliveries.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <BadgeCheck className="text-blue-600 mb-4" size={36} />
              <h3 className="font-semibold text-xl mb-2">Zero fake tolerance</h3>
              <p className="text-gray-600">
                Any seller involved in counterfeit or misleading activity is permanently
                removed from Merkova.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES (TEMU STYLE) */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-[#1e40af] mb-14">Our values</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex gap-6">
            <Users className="text-blue-600" size={40} />
            <div>
              <h3 className="text-xl font-semibold">Trust & transparency</h3>
              <p className="text-gray-600 mt-2">
                Every interaction on Merkova is built on honesty, visibility, and customer
                protection.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <Globe className="text-blue-600" size={40} />
            <div>
              <h3 className="text-xl font-semibold">Inclusion & growth</h3>
              <p className="text-gray-600 mt-2">
                We empower Bangladeshi businesses and global partners to grow responsibly.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <ShieldCheck className="text-blue-600" size={40} />
            <div>
              <h3 className="text-xl font-semibold">Security first</h3>
              <p className="text-gray-600 mt-2">
                Bank‑grade encryption, secure payments, and constant monitoring protect every
                transaction.
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <HeartHandshake className="text-blue-600" size={40} />
            <div>
              <h3 className="text-xl font-semibold">Social responsibility</h3>
              <p className="text-gray-600 mt-2">
                Merkova actively works to reduce fraud, waste, and financial loss in online
                commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <footer className="bg-black text-gray-300 py-10 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Merkova. A trusted trillion‑dollar‑vision e‑commerce
          company proudly serving Bangladesh.
        </p>
      </footer>
    </div>
  );
};

export default AboutMerkova;
