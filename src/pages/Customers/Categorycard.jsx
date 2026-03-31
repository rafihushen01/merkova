import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { serverurl } from "../../App.jsx";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${serverurl}/category/active`);
        if (data.success) setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg animate-pulse">Loading Categories...</p>
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-900">
        Explore Categories
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <motion.a
            key={cat._id}
            href={cat.navigatelink || "#"}
            className="flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
            whileHover={{ scale: 1.08 }}
          >
            <div className="w-24 h-24 md:w-28 md:h-28 mb-3 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
              <img
                src={cat.image || "/placeholder.png"}
                alt={cat.name}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="text-sm md:text-base font-semibold text-gray-800">
              {cat.name}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
