import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import {
  addLand,
  getFarmerLands,
  updateLand,
  deleteLand
} from "../../api/farmerApi";
// SaaS Icons
import { Map, MapPin, Droplets, Move, Edit3, Trash2, PlusCircle, Info, Shovel } from "lucide-react";

const FarmerLands = () => {
  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [lands, setLands] = useState([]);
  const [form, setForm] = useState({
    areaInAcre: "",
    soilType: "",
    irrigationType: "",
    village: "",
    district: "",
    state: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmerId) fetchLands();
  }, [farmerId]);

  const fetchLands = async () => {
    try {
      const res = await getFarmerLands(farmerId);
      setLands(res.data || []);
    } catch (error) {
      console.error("Error fetching lands", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.areaInAcre || !form.soilType) {
      alert("Area and Soil type are required");
      return;
    }

    try {
      if (editingId) {
        await updateLand(farmerId, editingId, form);
        setEditingId(null);
      } else {
        await addLand(farmerId, form);
      }

      setForm({ areaInAcre: "", soilType: "", irrigationType: "", village: "", district: "", state: "" });
      fetchLands();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (land) => {
    setForm(land);
    setEditingId(land.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (landId) => {
    if (!window.confirm("Are you sure you want to delete this land parcel?")) return;
    await deleteLand(farmerId, landId);
    fetchLands();
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Map className="text-green-600" /> Asset Management
          </h1>
          <p className="text-slate-500 mt-1">Register and manage your farm land parcels and soil health profiles.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 🔹 Left Panel: Add / Edit Land (4 cols) */}
          <div className="lg:col-span-4">
            <div className={`bg-white p-6 rounded-3xl shadow-sm border transition-all duration-300 sticky top-24 ${
              editingId ? "border-blue-200 ring-4 ring-blue-50" : "border-slate-100"
            }`}>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                {editingId ? <Edit3 className="text-blue-500" /> : <PlusCircle className="text-green-500" />}
                {editingId ? "Edit Land Details" : "Register New Land"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Area (Acres)</label>
                    <input name="areaInAcre" placeholder="0.0" value={form.areaInAcre} onChange={handleChange} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Soil Type</label>
                    <input name="soilType" placeholder="e.g. Black, Red" value={form.soilType} onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Irrigation Method</label>
                  <input name="irrigationType" placeholder="e.g. Drip, Tube-well" value={form.irrigationType} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" />
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Village</label>
                  <input name="village" placeholder="Location" value={form.village} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input name="district" placeholder="District" value={form.district} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" />
                  <input name="state" placeholder="State" value={form.state} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none" />
                </div>

                <button type="submit" className={`w-full py-3 mt-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                  editingId ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" : "bg-green-600 hover:bg-green-700 shadow-green-200"
                }`}>
                  {editingId ? "Save Changes" : "Register Land Asset"}
                </button>
              </form>

              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
                <Info size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Accurate land details help our AI suggest better crops based on your soil and regional weather.
                </p>
              </div>
            </div>
          </div>

          {/* 🔹 Right Panel: Land Parcel Cards (8 cols) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lands.map((land) => (
                <div key={land.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-green-50 text-green-700 p-3 rounded-2xl">
                        <Move size={24} />
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(land)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDelete(land.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-black text-slate-900">{land.areaInAcre}</span>
                        <span className="text-slate-400 font-bold mb-1 uppercase text-xs tracking-tighter">Acres Total</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                        <div className="flex items-center gap-2">
                          <Shovel size={16} className="text-amber-600" />
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Soil Type</p>
                            <p className="text-xs font-bold text-slate-700">{land.soilType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-blue-500" />
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Irrigation</p>
                            <p className="text-xs font-bold text-slate-700">{land.irrigationType || "Rain-fed"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-2 text-slate-500">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <p className="text-xs leading-tight font-medium">
                          {land.village}, {land.district}, {land.state}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Footer */}
                  <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-300 opacity-20" />
                </div>
              ))}

              {!loading && lands.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <Map size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500 font-bold">No land assets registered yet.</p>
                  <p className="text-xs text-slate-400">Add your first parcel to start planning your crops.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerLands;