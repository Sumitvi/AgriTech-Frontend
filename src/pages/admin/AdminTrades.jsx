import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllTrades } from "../../api/adminApi";
// Icons for a SaaS-level feel
import { ShoppingCart, User, IndianRupee, Layers, Calendar, ChevronRight, Search, Download } from "lucide-react";

const AdminTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const res = await getAllTrades();
      setTrades(res.data);
    } catch (error) {
      console.error("Error fetching trades", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10";
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/10";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/10";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100 ring-slate-500/10";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Marketplace Trades 
              <span className="text-sm font-normal text-slate-400 bg-slate-200/50 px-2 py-1 rounded-md">{trades.length} Total</span>
            </h1>
            <p className="text-slate-500 mt-1">Review and manage crop transactions across the platform.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-wrap gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by crop or farmer..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              />
           </div>
           <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Sort by:</span>
              <select className="bg-transparent font-semibold text-sm text-slate-700 outline-none cursor-pointer">
                <option>Newest First</option>
                <option>Highest Price</option>
                <option>Large Quantity</option>
              </select>
           </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Crop Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Volume</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Expected Rate</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Farmer</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-green-50/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shadow-inner">
                           <ShoppingCart size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-1 capitalize">
                            {trade.crop?.cropName || "Unknown Crop"}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                            <Calendar size={10} /> {new Date().toLocaleDateString()} {/* Assuming dynamic date later */}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg">
                        <Layers size={14} className="text-slate-500" />
                        <span className="font-bold text-slate-700">{trade.quantityQuintal || 0}</span>
                        <span className="text-xs text-slate-400 font-medium">Quintal</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <p className="text-lg font-black text-slate-900 flex items-center justify-center">
                        <IndianRupee size={16} className="text-slate-400" />
                        {trade.expectedRate?.toLocaleString() || 0}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600">
                           <User size={14} />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">
                          {trade.farmer?.name || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ring-1 ${getStatusStyles(trade.status)}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {trade.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                       <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 rounded-lg inline-block">
                          <ChevronRight size={18} className="text-slate-400" />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && trades.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-200">
                <ShoppingCart size={32} className="text-slate-200" />
              </div>
              <h3 className="text-slate-800 font-bold">No trades found</h3>
              <p className="text-slate-400 text-sm">Active trades from farmers will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTrades;