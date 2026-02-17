import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { addProduct, deactivateProduct, getMyProducts } from "../../api/StoreOwnerApi";
// SaaS Icons
import { 
  Package, 
  Tag, 
  IndianRupee, 
  Layers, 
  PlusCircle, 
  Power, 
  AlertCircle, 
  FileText,
  Loader2,
  CheckCircle2
} from "lucide-react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stockQuantity: ""
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsFetching(true);
      const res = await getMyProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stockQuantity) {
      alert("Please fill in the required fields.");
      return;
    }

    try {
      setLoading(true);
      await addProduct({
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity)
      });
      setForm({ name: "", category: "", description: "", price: "", stockQuantity: "" });
      fetchProducts();
      alert("Product successfully added to inventory! 📦");
    } catch (error) {
      console.error("Add product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this product? It will no longer be visible to farmers.")) return;
    try {
      await deactivateProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Deactivate error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="text-green-600" /> Catalog Management
          </h1>
          <p className="text-slate-500 mt-1">Add new inventory items or manage your existing store catalog.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 🔹 Left: Add Product Form (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <PlusCircle className="text-green-600" /> Add New Item
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Organic Seeds"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Fertilizers"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Stock</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} placeholder="Qty"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Product Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Detailed product info..." rows="3"
                    className="w-all px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                  {loading ? "Registering..." : "Add to Store"}
                </button>
              </form>
            </div>
          </div>

          {/* 🔹 Right: Inventory Table (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Current Inventory</h2>
                <div className="bg-slate-50 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 tracking-[0.2em] border border-slate-100">
                  {products.length} PRODUCTS
                </div>
              </div>

              {isFetching ? (
                <div className="p-20 text-center text-slate-400 flex flex-col items-center">
                  <Loader2 className="animate-spin mb-4" size={40} />
                  <p className="font-bold uppercase tracking-widest text-xs">Syncing Catalog...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="py-24 text-center">
                  <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                  <h3 className="text-slate-800 font-bold">Your store is empty</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Start adding items to your catalog to make them available for farmers.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-8 py-5">Product Details</th>
                        <th className="px-4 py-5">Category</th>
                        <th className="px-4 py-5 text-right">Price</th>
                        <th className="px-4 py-5 text-center">Stock</th>
                        <th className="px-4 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {products.map((product) => (
                        <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5">
                            <p className="font-bold text-slate-800">{product.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{product.description}</p>
                          </td>
                          <td className="px-4 py-5">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-5 text-right">
                            <p className="font-black text-slate-900">₹{product.price}</p>
                          </td>
                          <td className="px-4 py-5 text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <Layers size={12} className="text-slate-300" />
                              <span className="text-sm font-bold text-slate-700">{product.stockQuantity}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            {product.active ? (
                              <div className="flex items-center gap-1.5 text-emerald-600">
                                <CheckCircle2 size={16} />
                                <span className="text-xs font-bold">Live</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-rose-400">
                                <AlertCircle size={16} />
                                <span className="text-xs font-bold italic">Offline</span>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            {product.active && (
                              <button onClick={() => handleDeactivate(product.id)}
                                className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm border border-rose-100"
                              >
                                <Power size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🔹 Storage Notice */}
        <div className="mt-12 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex flex-col md:flex-row items-center gap-4">
           <div className="bg-white p-3 rounded-2xl text-blue-500 shadow-sm border border-blue-100">
              <AlertCircle size={24} />
           </div>
           <div>
              <p className="font-bold text-blue-900">Inventory Notice</p>
              <p className="text-xs text-blue-700/70 font-medium">Deactivated products will no longer appear in the farmer store, but they will remain in your archives for sales reporting.</p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageProducts;