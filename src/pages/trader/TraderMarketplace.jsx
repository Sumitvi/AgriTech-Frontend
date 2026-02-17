import { useEffect, useState, useContext } from "react";
import { getListedTrades, buyCrop } from "../../api/traderApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
// SaaS Icons
import { 
  ShoppingBag, 
  Scale, 
  IndianRupee, 
  Search, 
  Filter, 
  ChevronRight, 
  Tag,
  Loader2,
  TrendingUp
} from "lucide-react";

const TraderMarketplace = () => {
  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const res = await getListedTrades();
      setTrades(res.data || []);
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (trade) => {
    if (!traderId) {
      alert("Trader not logged in properly.");
      return;
    }

    try {
      const payload = {
        tradeId: trade.id,
        traderId: traderId,
        offeredRate: trade.expectedRate,
      };

      await buyCrop(payload);
      alert(`Successfully secured ${trade.cropName}!`);
      fetchTrades();
    } catch (error) {
      console.error("Buy error:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  const filteredTrades = trades.filter(t => 
    t.cropName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* 🔹 Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="text-green-600" /> Crop Marketplace
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Browse and acquire fresh harvests directly from verified farmers.</p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-bold text-slate-400">
            <TrendingUp size={16} className="text-green-500" /> LIVE MARKET FEED
          </div>
        </div>

        {/* 🔹 Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by crop name (e.g. Basmati, Wheat)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} /> Market Filters
          </button>
        </div>

        {/* 🔹 Marketplace Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Accessing exchange...</p>
          </div>
        ) : filteredTrades.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <ShoppingBag size={32} className="text-slate-200" />
            </div>
            <h3 className="text-slate-800 font-bold text-xl">Market is quiet</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">There are currently no listed crops matching your search. Check back soon for new harvests.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTrades.map((trade) => (
              <div 
                key={trade.id} 
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden flex flex-col"
              >
                {/* Visual Header */}
                <div className="p-6 pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-50 text-green-700 p-3 rounded-2xl shadow-inner group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
                      <Tag size={20} />
                    </div>
                    <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100">
                      ID: #{trade.id.toString().slice(-4)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-800 capitalize leading-tight mb-4">
                    {trade.cropName}
                  </h3>
                </div>

                {/* Trade Details */}
                <div className="px-6 space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Listed Volume</p>
                      <div className="flex items-center gap-1.5 font-black text-slate-700">
                        <Scale size={14} className="text-slate-300" />
                        {trade.quantityQuintal} <span className="text-[10px] font-medium text-slate-400">Qtl</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Ask Rate</p>
                      <div className="flex items-center gap-0.5 font-black text-slate-900">
                        <IndianRupee size={14} className="text-slate-300" />
                        {trade.expectedRate.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Deal Value</p>
                    <p className="text-xl font-black text-green-600 tracking-tight">
                      ₹{(trade.quantityQuintal * trade.expectedRate).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 mt-4">
                  <button
                    onClick={() => handleBuy(trade)}
                    className="w-full bg-slate-900 hover:bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-slate-200 hover:shadow-green-100"
                  >
                    Secure Inventory <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TraderMarketplace;