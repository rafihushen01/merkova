import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { serverurl } from "../../App.jsx"; // Merkova fixed convention
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Justforu = () => {
  const [products, setProducts] = useState([]);
  const [visibleRows, setVisibleRows] = useState(6); // default 6 rows
  const productsPerRow = 5;
  const navigate=useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${serverurl}/item/headoffice/justforyou`,{    withCredentials: true});
        setProducts(res.data.items || []);
      } catch (err) {
        console.error("Failed to fetch Just For You items", err);
      }
    };
    fetchProducts();
  }, []);

  const handleShowMore = () => {
    setVisibleRows(prev => prev + 3); // load 3 more rows each time
  };

  const visibleProducts = products.slice(0, visibleRows * productsPerRow);

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      <h2 className="text-2xl font-bold mb-6">Deals You Cant Missed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {visibleProducts.map((item) => (
          <motion.div
            key={item._id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-full h-40 md:h-48 lg:h-56 overflow-hidden flex items-center justify-center bg-gray-50">
              <img
                src={item.colorvariants[0]?.images[0]?.url || "/placeholder.png"}
                alt={item.title}
                className="object-contain w-full h-full"
              
              />
            </div>
            <div className="p-3 flex flex-col flex-1 justify-between">
              <h3 className="text-sm md:text-base font-medium line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center mt-1">
                <span className="text-lg font-semibold text-red-600 mr-2">
                  ৳{item.currentprice}
                </span>
                {item.discountpercent > 0 && (
                  <span className="text-sm line-through text-gray-400">
                    ৳{item.baseprice}
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(item.rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  ({item.totalreviews})
                </span>
              </div>
              <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-md text-sm md:text-base transition-colors" onClick={()=>navigate(`/products/${item._id}`)}>
                View Product
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {visibleProducts.length < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md text-base font-medium transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Justforu;
