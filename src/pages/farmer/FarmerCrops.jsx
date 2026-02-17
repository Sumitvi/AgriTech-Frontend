import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CropCard from "../../components/crops/CropCard";
import AddCropModal from "../../components/crops/AddCropModal";
import CropTimeline from "../../components/crops/CropTimeline";
import SellCropModal from "../../components/trade/SellCropModal";
import { AuthContext } from "../../context/AuthContext";
// SaaS Icons
import { Sprout, Loader2, Plus, Filter, LayoutGrid, List } from "lucide-react";

import {
  addCrop,
  getFarmerCrops,
  harvestCrop,
  getFarmerLands,
  sellCrop
} from "../../api/farmerApi";

const FarmerCrops = () => {
  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [crops, setCrops] = useState([]);
  const [lands, setLands] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    if (farmerId) fetchData();
  }, [farmerId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cropRes, landRes] = await Promise.all([
        getFarmerCrops(farmerId),
        getFarmerLands(farmerId)
      ]);
      setCrops(cropRes?.data || []);
      setLands(landRes?.data || []);
    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = async (form) => {
    if (!farmerId) return alert("Farmer not identified");
    if (!form?.landId) return alert("Please select land");

    try {
      await addCrop(farmerId, form.landId, form);
      fetchData();
    } catch (error) {
      console.error("Error adding crop:", error);
    }
  };

  const handleHarvest = async (id) => {
    const actualYield = prompt("Enter Actual Yield (in Quintals)");
    if (!actualYield) return;

    try {
      await harvestCrop(id, Number(actualYield));
      fetchData();
    } catch (error) {
      console.error("Harvest error:", error);
    }
  };

  const handleSell = (crop) => setSelectedCrop(crop);

  const handleSellSubmit = async (form) => {
    if (!selectedCrop?.id || !farmerId) return alert("Validation Error");

    const payload = {
      farmerId: farmerId,
      cropId: selectedCrop.id,
      quantityQuintal: Number(form.quantityQuintal),
      expectedRate: Number(form.expectedRate)
    };

    try {
      await sellCrop(payload);
      setSelectedCrop(null);
      fetchData();
      alert("Crop successfully listed for trade!");
    } catch (error) {
      console.error("Sell error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* 🔹 Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sprout className="text-green-600" /> My Crop Lifecycle
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Manage growth, harvest, and marketplace listings.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <AddCropModal lands={lands} onAdd={handleAddCrop} />
          </div>
        </div>

        {/* 🔹 Lifecycle Timeline Overview */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Seasonal Stage Overview</h3>
            <CropTimeline />
        </div>

        {/* 🔹 Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-green-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-green-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <List size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={16} /> Filter Status
            </button>
          </div>
        </div>

        {/* 🔹 Content Loading / Display */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold tracking-widest uppercase text-xs">Syncing crop data...</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {crops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                onHarvest={handleHarvest}
                onSell={handleSell}
                variant={viewMode}
              />
            ))}
            
            {crops.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-slate-300" size={32} />
                </div>
                <h3 className="text-slate-800 font-bold">No crops planted yet</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Start by selecting a land parcel and adding your first crop to track its growth.</p>
              </div>
            )}
          </div>
        )}

        {/* 🔹 Sell Modal (Conditional) */}
        {selectedCrop && (
          <SellCropModal
            crop={selectedCrop}
            onSubmit={handleSellSubmit}
            onClose={() => setSelectedCrop(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerCrops;