import { useState } from "react";
// SaaS Icons
import { X, Sprout, Calendar, Scale, Map, Plus, Info } from "lucide-react";

const AddCropModal = ({ lands = [], onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    landId: "",
    cropName: "",
    sowingDate: "",
    expectedHarvestDate: "",
    expectedYieldQuintal: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setIsOpen(false);
    setForm({
      landId: "",
      cropName: "",
      sowingDate: "",
      expectedHarvestDate: "",
      expectedYieldQuintal: ""
    });
  };

  const handleSubmit = () => {
    if (!form.landId || !form.cropName) {
      alert("Please fill in the required fields.");
      return;
    }
    onAdd(form);
    closeModal();
  };

  return (
    <>
      {/* 🔹 Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95"
      >
        <Plus size={20} /> Register New Crop
      </button>

      {/* 🔹 Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-green-50 p-6 flex justify-between items-center border-b border-green-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-xl text-white">
                  <Sprout size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Add New Crop</h3>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Growth Cycle Entry</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-white rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-8 space-y-5">
              
              {/* Land Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Assigned Land Parcel</label>
                <div className="relative">
                  <Map className="absolute left-3 top-3 text-slate-400" size={18} />
                  <select
                    name="landId"
                    value={form.landId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Choose a parcel...</option>
                    {lands.map((land) => (
                      <option key={land.id} value={land.id}>
                        {land.village} — {land.areaInAcre} Acre ({land.soilType} Soil)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Crop Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Crop Type</label>
                <div className="relative">
                  <Sprout className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    name="cropName"
                    value={form.cropName}
                    placeholder="e.g. Basmati Rice, Winter Wheat"
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none"
                  />
                </div>
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Sowing Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3 text-slate-400 group-focus-within:text-green-600" size={18} />
                    <input
                      name="sowingDate"
                      type="date"
                      value={form.sowingDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Est. Harvest</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3 text-slate-400 group-focus-within:text-green-600" size={18} />
                    <input
                      name="expectedHarvestDate"
                      type="date"
                      value={form.expectedHarvestDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Expected Yield */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Projected Yield (Quintals)</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    name="expectedYieldQuintal"
                    placeholder="Estimated output"
                    value={form.expectedYieldQuintal}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-[0.98]"
                >
                  Confirm Registration
                </button>
              </div>

              <div className="flex items-center gap-2 justify-center text-slate-400">
                <Info size={14} />
                <p className="text-[10px] font-medium tracking-wide">Data will be used for yield forecasting.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCropModal;