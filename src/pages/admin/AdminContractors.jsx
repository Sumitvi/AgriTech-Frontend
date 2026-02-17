import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  addContractor,
  verifyContractor,
  blockContractor,
  getAllContractors,
  searchContractors,
  updateContractor,
  deleteContractor
} from "../../api/adminApi";
// Professional SaaS Icon Set
import { 
  HardHat, 
  Search, 
  UserPlus, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  ShieldAlert, 
  Edit3, 
  Trash2, 
  Ban,
  Phone,
  Filter
} from "lucide-react";

const AdminContractors = () => {
  const [contractors, setContractors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    district: "",
    state: "",
    workType: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await getAllContractors();
      setContractors(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search) return fetchContractors();
    const res = await searchContractors(search);
    setContractors(res.data || []);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile) return alert("Fill required fields");

    if (editingId) {
      await updateContractor(editingId, form);
      setEditingId(null);
    } else {
      await addContractor(form);
    }

    setForm({ name: "", mobile: "", district: "", state: "", workType: "" });
    fetchContractors();
  };

  const handleEdit = (contractor) => {
    setEditingId(contractor.id);
    setForm(contractor);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contractor?")) return;
    await deleteContractor(id);
    fetchContractors();
  };

  const handleVerify = async (id) => {
    await verifyContractor(id);
    fetchContractors();
  };

  const handleBlock = async (id) => {
    await blockContractor(id);
    fetchContractors();
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <HardHat className="text-orange-500" /> Contractor Network
            </h1>
            <p className="text-slate-500 mt-1">Manage and verify service providers within the Agritech ecosystem.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 🔹 Sidebar: Add/Update Form (4 cols) */}
          <div className="lg:col-span-4">
            <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${editingId ? 'border-blue-200 ring-4 ring-blue-50' : 'border-slate-200'}`}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {editingId ? <Edit3 size={20} className="text-blue-500" /> : <UserPlus size={20} className="text-green-600" />}
                {editingId ? "Update Details" : "Register Contractor"}
              </h2>

              <form onSubmit={handleAddOrUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      placeholder="98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">District</label>
                    <input
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      placeholder="District"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">State</label>
                    <input
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      placeholder="State"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Work Type</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.workType}
                      onChange={(e) => setForm({ ...form, workType: e.target.value })}
                      placeholder="e.g. Irrigation, Harvesting"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 mt-2 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                    editingId ? "bg-blue-600 hover:bg-blue-700 shadow-blue-100" : "bg-green-600 hover:bg-green-700 shadow-green-100"
                  }`}
                >
                  {editingId ? "Update Contractor" : "Add Contractor"}
                </button>
              </form>
            </div>
          </div>

          {/* 🔹 Main Content: Search & List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search Toolbar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, district or work type..."
                  className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-slate-700 text-sm"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
              >
                Search
              </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Provider Details</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Location</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Work</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contractors.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold border border-slate-200 uppercase">
                              {c.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 leading-none mb-1">{c.name}</span>
                              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">{c.mobile}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin size={14} className="text-slate-400" />
                            <span>{c.district}, <span className="font-bold">{c.state}</span></span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                            {c.workType || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center gap-1.5">
                            {c.verified ? (
                              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <ShieldCheck size={10} /> Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                Pending
                              </span>
                            )}
                            <span className={`text-[10px] font-bold ${c.active ? 'text-blue-500' : 'text-rose-500'}`}>
                              {c.active ? 'Active' : 'Blocked'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => handleVerify(c.id)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Verify">
                              <ShieldCheck size={16} />
                            </button>
                            <button onClick={() => handleBlock(c.id)} className={`p-2 rounded-lg transition-all ${c.active ? 'text-slate-400 hover:text-orange-600 hover:bg-orange-50' : 'text-blue-600 hover:bg-blue-50'}`} title={c.active ? 'Block' : 'Unblock'}>
                              {c.active ? <Ban size={16} /> : <ShieldCheck size={16} />}
                            </button>
                            <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {!loading && contractors.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">No contractors found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminContractors;