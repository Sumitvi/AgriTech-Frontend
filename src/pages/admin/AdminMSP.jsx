import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  addMSP,
  getAllMSP,
  updateMSP,
  deleteMSP
} from "../../api/adminApi";
// Icons for a professional administrative UI
import { Sprout, IndianRupee, Edit3, Trash2, Search, PlusCircle, XCircle, Info } from "lucide-react";

const AdminMSP = () => {
  const [cropName, setCropName] = useState("");
  const [price, setPrice] = useState("");
  const [mspList, setMspList] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMSP();
  }, []);

  const fetchMSP = async () => {
    try {
      const res = await getAllMSP();
      setMspList(res.data || []);
    } catch (err) {
      console.error("Failed to fetch MSP", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cropName || !price) return;

    try {
      if (editId) {
        await updateMSP(editId, { cropName, mspPrice: price });
        setEditId(null);
      } else {
        await addMSP({ cropName, mspPrice: price });
      }
      setCropName("");
      setPrice("");
      fetchMSP();
    } catch (err) {
      alert("Action failed. Please try again.");
    }
  };

  const handleEdit = (msp) => {
    setCropName(msp.cropName);
    setPrice(msp.mspPrice);
    setEditId(msp.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this MSP entry?")) {
      await deleteMSP(id);
      fetchMSP();
    }
  };

  const filteredMSP = mspList.filter(m =>
    m.cropName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sprout className="text-green-600" /> MSP Management
          </h1>
          <p className="text-slate-500 mt-1">Set and update the Minimum Support Price for various crop types.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 🔹 Left Column: Add / Edit Form */}
          <div className="lg:col-span-1">
            <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all duration-300 ${editId ? 'border-blue-200 ring-4 ring-blue-50' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {editId ? <Edit3 size={20} className="text-blue-500" /> : <PlusCircle size={20} className="text-green-500" />}
                  {editId ? "Edit Entry" : "Add New MSP"}
                </h2>
                {editId && (
                  <button onClick={() => {setEditId(null); setCropName(""); setPrice("");}} className="text-slate-400 hover:text-slate-600">
                    <XCircle size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Crop Name</label>
                  <input
                    type="text"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Wheat, Paddy, Corn"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">MSP Price (per Quintal)</label>
                  <div className="relative">
                    <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                    editId 
                    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" 
                    : "bg-green-600 hover:bg-green-700 shadow-green-200"
                  }`}
                >
                  {editId ? "Update MSP Price" : "Register MSP"}
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <Info size={24} className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Updating the MSP will immediately reflect across all farmer dashboards and trade calculations.
                </p>
              </div>
            </div>
          </div>

          {/* 🔹 Right Column: List and Search */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Toolbar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Filter by crop name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-slate-700"
                />
              </div>
              <div className="h-6 w-[1px] bg-slate-200"></div>
              <p className="text-xs font-bold text-slate-400 px-2 uppercase tracking-tighter">
                {filteredMSP.length} Items
              </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Crop Type</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Minimum Support Price</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMSP.map(msp => (
                    <tr key={msp.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 capitalize">{msp.cropName}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-green-50 text-green-700 rounded-full font-black text-sm border border-green-100">
                          <IndianRupee size={14} /> {msp.mspPrice.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(msp)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(msp.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMSP.length === 0 && (
                <div className="py-20 text-center">
                  <Sprout size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500 font-medium">No MSP records found.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminMSP;