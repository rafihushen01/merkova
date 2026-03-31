import React from 'react';
import { motion } from 'framer-motion';
import { BadgeDollarSign, ShieldCheck, CreditCard, Truck } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: BadgeDollarSign,
    title: "Competitive Price",
    subtitle: "Get The Best Prices Everyday",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Authentic Products",
    subtitle: "Secured with Brand Warranty",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Easy & Secured Payment",
    subtitle: "Pre-payment, Cash on Delivery",
  },
  {
    id: 4,
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "Rapid delivery At Your Doorstep",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
};

const Middlepart = () => {
  return (
    <section className="w-full py-10 px-4 bg-slate-50 flex justify-center items-center">
      {/* Merkova Card Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-7xl bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-100 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-slate-100">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ 
                backgroundColor: "rgba(239, 246, 255, 0.5)", // extremely light blue
                scale: 1.02,
              }}
              className="group relative p-6 flex flex-row items-center gap-4 cursor-pointer transition-colors duration-300"
            >
              {/* Animated Icon Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-full" />
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 transition-colors duration-300"
                >
                  <feature.icon 
                    size={32} 
                    className="text-blue-600 group-hover:text-white transition-colors duration-300" 
                    strokeWidth={1.5}
                  />
                </motion.div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {feature.subtitle}
                </p>
              </div>

              {/* Subtle Blue Indicator Line on Hover (Bottom) */}
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-blue-600 w-0"
                whileHover={{ w: "100%" }} // This isn't valid framer motion syntax for width usually, handled via class or layout
              />
               <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Middlepart;