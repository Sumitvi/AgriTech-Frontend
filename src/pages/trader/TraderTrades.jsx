import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getTraderTrades, initiatePayment } from "../../api/traderApi";
// SaaS Icons
import { 
  Package, 
  User, 
  Scale, 
  IndianRupee, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Wallet,
  Loader2
} from "lucide-react";

const TraderTrades = () => {
  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (traderId) fetchTrades();
  }, [traderId]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const res = await getTraderTrades(traderId);
      setTrades(res.data || []);
    } catch (error) {
      console.error("Trade fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (trade) => {
    const rateToUse = trade.finalRate ?? trade.expectedRate;
    const totalAmount = (rateToUse || 0) * (trade.quantityQuintal || 0);

    const payload = {
      tradeId: trade.id,
      amount: totalAmount,
    };

    try {
      await initiatePayment(payload);
      alert(`Payment of ₹${totalAmount.toLocaleString()} initiated successfully!`);
      fetchTrades();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment initiation failed. Please check your balance.");
    }
  };

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
      case "SOLD":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "PAID":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Package className="text-blue-600" /> Procurement Ledger
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Manage your crop acquisitions and farmer settlements.</p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Trades</p>
              <p className="text-lg font-black text-slate-900">{trades.length}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase tracking-widest text-xs">Syncing trade data...</p>
          </div>
        ) : trades.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-slate-800 font-bold">No active trades</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">Your accepted crop listings and purchases will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trades.map((trade) => {
              const rate = trade.finalRate ?? trade.expectedRate;
              const totalAmount = (rate || 0) * (trade.quantityQuintal || 0);
              const statusStyle = getStatusStyles(trade.status);

              return (
                <div key={trade.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                  <div className="p-6 md:p-8">
                    {/* Top Row: Crop & Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                          <Package size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 capitalize">{trade.crop?.cropName}</h3>
                          <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusStyle}`}>
                             {trade.status === 'PAID' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                             {trade.status}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Payout</p>
                        <p className="text-2xl font-black text-blue-600">₹{totalAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Middle: Farmer & Specs */}
                    <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><User size={16} /></div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Farmer</p>
                          <p className="text-xs font-bold text-slate-700">{trade.farmer?.name || "Member"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><Scale size={16} /></div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Quantity</p>
                          <p className="text-xs font-bold text-slate-700">{trade.quantityQuintal} Quintals</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Rate & Action */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-1 text-slate-400">
                        <IndianRupee size={14} />
                        <span className="text-sm font-bold text-slate-700">{rate}</span>
                        <span className="text-[10px] uppercase font-bold tracking-tighter ml-1">per qtl</span>
                      </div>

                      {(trade.status === "SOLD" || trade.status === "ACCEPTED") && (
                        <button
                          onClick={() => handlePayment(trade)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-100 flex items-center gap-2 transition-all active:scale-95"
                        >
                          <CreditCard size={18} />
                          Pay Now
                        </button>
                      )}
                      
                      {trade.status === "PAID" && (
                        <div className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 size={16} /> Settlement Complete
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative Footer */}
                  <div className={`h-1.5 w-full bg-blue-500 opacity-20`} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TraderTrades;