import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStoreProducts, addToCart } from "../../api/farmerApi";
// SaaS Icons
import { ShoppingCart, Tag, Box, Search, Filter, Leaf, ChevronRight, AlertCircle } from "lucide-react";

const FarmerStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getStoreProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Store fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({ productId, quantity: 1 });
      alert("Added to cart! 🛒");
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* 🔹 Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Leaf className="text-green-600" /> Agri Input Store
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Premium seeds, fertilizers, and tools for your farm.</p>
          </div>
          <button className="relative p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:bg-slate-50 transition-all">
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
              0
            </span>
          </button>
        </div>

        {/* 🔹 Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search for seeds, urea, pesticides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* 🔹 Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-80 bg-slate-200 rounded-[2rem] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden flex flex-col"
              >
                {/* Product Image Placeholder */}
                <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <Box size={48} className="text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-100 shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-1 group-hover:text-green-700 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Tag size={12} /> SKU: AGRI-{product.id}
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Price</p>
                        <p className="text-2xl font-black text-slate-900">₹{product.price}</p>
                      </div>
                      <div className="text-right">
                        {product.stockQuantity < 10 ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                            <AlertCircle size={10} /> LOW STOCK
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tighter">
                            In Stock: {product.stockQuantity}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-slate-900 group-hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-slate-200 group-hover:shadow-green-100"
                    >
                      <ShoppingCart size={18} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="py-24 text-center">
             <div className="bg-white p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <Box size={32} className="text-slate-200" />
             </div>
             <h3 className="text-slate-800 font-bold text-lg">No supplies found</h3>
             <p className="text-slate-400 text-sm max-w-xs mx-auto">Try searching for a different product or check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerStore;