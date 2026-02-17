import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  addMandiPrice,
  getAllMandi,
  updateMandiPrice,
  deleteMandiPrice,
} from "../../api/adminApi";
// SaaS Icons
import { 
  MapPin, 
  Tag, 
  Landmark, 
  IndianRupee, 
  Search, 
  Edit3, 
  Trash2, 
  Plus, 
  Filter,
  ArrowUpDown
} from "lucide-react";

const AdminMandi = () => {
  const [form, setForm] = useState({
    cropName: "",
    state: "",
    mandiName: "",
    modalPrice: "",
  });

  const [mandiList, setMandiList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMandi();
  }, []);

  const fetchMandi = async () => {
    try {
      const res = await getAllMandi();
      setMandiList(res.data || []);
    } catch (error) {
      console.error("Error fetching Mandi data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cropName || !form.modalPrice) return;

    try {
      if (editingId) {
        await updateMandiPrice(editingId, form);
      } else {
        await addMandiPrice(form);
      }
      
      setForm({ cropName: "", state: "", mandiName: "", modalPrice: "" });
      setEditingId(null);
      fetchMandi();
    } catch (err) {
      console.error("Operation failed", err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this mandi price entry?")) {
      await deleteMandiPrice(id);
      fetchMandi();
    }
  };

  const filtered = mandiList.filter(
    (m) =>
      m.cropName.toLowerCase().includes(search.toLowerCase()) ||
      m.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
               Market Mandi Rates
            </h1>
            <p className="text-slate-500 mt-1">Update real-time modal prices for regional mandis.</p>
          </div>
        </div>

        {/* 🔹 Action Card: Add/Edit Mandi */}
        <div className={`bg-white p-6 rounded-2xl shadow-sm border mb-8 transition-all ${editingId ? 'border-blue-200 ring-4 ring-blue-50' : 'border-slate-200'}`}>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            {editingId ? <Edit3 size={16} /> : <Plus size={16} />}
            {editingId ? "Update Existing Entry" : "Register New Mandi Price"}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                name="cropName" 
                value={form.cropName} 
                onChange={handleChange} 
                placeholder="Crop Name" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" 
              />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                name="state" 
                value={form.state} 
                onChange={handleChange} 
                placeholder="State" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" 
              />
            </div>
            <div className="relative">
              <Landmark size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                name="mandiName" 
                value={form.mandiName} 
                onChange={handleChange} 
                placeholder="Mandi Name" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" 
              />
            </div>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                name="modalPrice" 
                value={form.modalPrice} 
                onChange={handleChange} 
                placeholder="Price" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" 
              />
            </div>

            <button className={`md:col-span-4 py-3 rounded-xl font-bold text-white transition-all active:scale-[0.98] shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}>
              {editingId ? "Apply Price Update" : "Publish Mandi Price"}
            </button>
          </form>
        </div>

        {/* 🔹 Search & Table Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96 group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
            <input
              type="text"
              placeholder="Search crop, state or mandi..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 text-slate-500 font-semibold text-sm hover:text-slate-800 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200">
            <Filter size={16} /> Advanced Filters
          </button>
        </div>

        {/* 🔹 Table Container */}
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Crop Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Location</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Modal Price</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 capitalize flex items-center gap-2">
                       {m.cropName}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                       <span className="text-sm font-semibold text-slate-700 capitalize">{m.mandiName}</span>
                       <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{m.state}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 px-4 py-1 bg-green-50 text-green-700 rounded-full font-black text-sm border border-green-100">
                       <IndianRupee size={14} /> {m.modalPrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(m)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
               <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Landmark size={32} />
               </div>
               <p className="text-lg font-medium">No mandi records found</p>
               <p className="text-sm">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminMandi;