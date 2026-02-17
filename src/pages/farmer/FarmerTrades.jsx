import { useEffect, useContext, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getTradeHistory } from "../../api/farmerApi";
// SaaS Icons
import { ShoppingCart, IndianRupee, Layers, CheckCircle2, Clock, AlertCircle, Calendar, ArrowRight } from "lucide-react";

const FarmerTrades = () => {
  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmerId) fetchTrades();
  }, [farmerId]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const res = await getTradeHistory(farmerId);
      setTrades(res.data || []);
    } catch (error) {
      console.error("Trade fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "APPROVED":
        return { color: "text-emerald-700 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 size={14} /> };
      case "PENDING":
        return { color: "text-amber-700 bg-amber-50 border-amber-100", icon: <Clock size={14} /> };
      case "REJECTED":
        return { color: "text-rose-700 bg-rose-50 border-rose-100", icon: <AlertCircle size={14} /> };
      default:
        return { color: "text-slate-600 bg-slate-50 border-slate-100", icon: null };
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShoppingCart className="text-green-600" /> Marketplace History
          </h1>
          <p className="text-slate-500 mt-1">Review your listed crops and completed trade transactions.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-3xl w-full" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && trades.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <ShoppingCart size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-slate-800 font-bold">No trades recorded</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Your marketplace activity will appear here once you list crops for sale.</p>
          </div>
        )}

        {/* Trade List */}
        <div className="space-y-4">
          {trades.map((trade) => {
            const config = getStatusStyles(trade.status);
            return (
              <div 
                key={trade.id} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-6 group"
              >
                {/* Left: Crop Info */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="h-14 w-14 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center shrink-0 border border-green-100 shadow-inner">
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 capitalize leading-none mb-1">
                      {trade.crop?.cropName || "Unknown Crop"}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                      <Calendar size={12} /> Listed on: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Center: Financial Stats */}
                <div className="flex flex-1 items-center justify-around w-full border-y md:border-y-0 md:border-x border-slate-50 py-4 md:py-0 px-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Volume</p>
                    <div className="flex items-center gap-1 justify-center">
                      <Layers size={14} className="text-slate-300" />
                      <span className="text-lg font-black text-slate-700">{trade.quantityQuintal}</span>
                      <span className="text-[10px] font-bold text-slate-400">Qtl</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Rate</p>
                    <div className="flex items-center gap-0.5 justify-center">
                      <IndianRupee size={16} className="text-slate-300" />
                      <span className="text-xl font-black text-slate-900">{trade.expectedRate?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status & Action */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${config.color}`}>
                    {config.icon}
                    {trade.status || "PENDING"}
                  </div>
                  <button className="p-3 bg-slate-50 text-slate-300 group-hover:bg-green-600 group-hover:text-white rounded-xl transition-all">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerTrades;