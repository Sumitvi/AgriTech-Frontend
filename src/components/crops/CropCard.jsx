import { Sprout, Shovel, Scale, ShoppingCart, Calendar, MapPin, ChevronRight, Activity } from "lucide-react";

const CropCard = ({ crop, onHarvest, onSell, variant = "grid" }) => {
  const isHarvested = crop.status === "HARVESTED";
  
  // Define status styling and icons
  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "SOWN":
        return { color: "text-blue-600 bg-blue-50 border-blue-100", icon: <Sprout size={14} /> };
      case "GROWING":
        return { color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <Activity size={14} /> };
      case "HARVESTED":
        return { color: "text-amber-600 bg-amber-50 border-amber-100", icon: <Shovel size={14} /> };
      default:
        return { color: "text-slate-600 bg-slate-50 border-slate-100", icon: null };
    }
  };

  const config = getStatusConfig(crop.status);

  // Grid Layout View
  if (variant === "grid") {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${config.color}`}>
              {config.icon}
              {crop.status}
            </div>
            <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <Calendar size={12} /> {new Date().toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-800 capitalize mb-1">{crop.cropName}</h3>
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1 mb-6">
            <MapPin size={12} /> {crop.land?.village || "Main Farm Area"}
          </p>

          {/* Yield Section */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Expected Yield</p>
                <p className="text-lg font-black text-slate-700">{crop.expectedYieldQuintal || "0"} <span className="text-xs font-medium text-slate-400">Qtl</span></p>
              </div>
              {crop.actualYieldQuintal && (
                <div className="text-right">
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Harvested</p>
                  <p className="text-lg font-black text-green-600">{crop.actualYieldQuintal} <span className="text-xs font-medium text-green-400">Qtl</span></p>
                </div>
              )}
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ${isHarvested ? 'bg-amber-500' : 'bg-green-500'}`} 
                 style={{ width: isHarvested ? '100%' : '40%' }} 
               />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-50">
            {!isHarvested ? (
              <button
                onClick={() => onHarvest(crop.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Scale size={18} /> Harvest Crop
              </button>
            ) : (
              <button
                onClick={() => onSell(crop)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingCart size={18} /> Sell in Marketplace
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List Layout View
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 hover:border-green-200 transition-colors">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${config.color}`}>
          {config.icon || <Sprout />}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 leading-none mb-1">{crop.cropName}</h3>
          <p className="text-xs text-slate-400 font-medium">Expected: {crop.expectedYieldQuintal} Qtl</p>
        </div>
      </div>

      <div className="flex items-center gap-8 px-4 border-x border-slate-50 hidden lg:flex">
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase">Status</p>
          <p className="text-xs font-bold text-slate-600 capitalize">{crop.status.toLowerCase()}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase">Harvested</p>
          <p className="text-xs font-bold text-green-600">{crop.actualYieldQuintal || "0"} Qtl</p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        {!isHarvested ? (
          <button onClick={() => onHarvest(crop.id)} className="flex-1 md:flex-none px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-lg hover:bg-green-600 hover:text-white transition-all">
            Harvest
          </button>
        ) : (
          <button onClick={() => onSell(crop)} className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
            Sell
          </button>
        )}
        <button className="p-2 text-slate-300 hover:text-slate-600">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CropCard;