import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { buyCrop } from "../../api/traderApi";
// SaaS Icons
import { X, IndianRupee, Scale, HandCoins, AlertCircle, Loader2 } from "lucide-react";

const BuyCropModal = ({ trade, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!rate) {
      alert("Please enter your offered rate to proceed.");
      return;
    }

    const payload = {
      tradeId: trade.id,
      traderId: traderId,
      offeredRate: Number(rate)
    };

    try {
      setLoading(true);
      await buyCrop(payload);
      alert("Offer submitted successfully! 🌾");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Buy error:", error);
      alert("Unable to process trade. Check your network or balance.");
    } finally {
      setLoading(false);
    }
  };

  if (!trade) return null;

  // Logic: Calculate total commitment
  const totalCommitment = Number(rate) * (trade.qty || 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 🔹 Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* 🔹 Modal Container */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Bid for {trade.cropName}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Transaction ID: #{trade.id.toString().slice(-6)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Trade Context Badges */}
        <div className="px-8 pt-6 flex gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-[10px] font-black uppercase tracking-wider">
            <Scale size={14} /> {trade.qty} Qtl
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 text-[10px] font-black uppercase tracking-wider">
            <IndianRupee size={14} /> Ask: {trade.rate}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Your Offered Rate (per Qtl)</label>
            <div className="relative group">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type="number"
                placeholder="Enter amount..."
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none text-lg font-black text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* 🔹 Real-time Calculation */}
          {rate && (
            <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200 animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center opacity-60 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                <span>Projected Payout</span>
                <HandCoins size={14} />
              </div>
              <div className="text-3xl font-black tracking-tight">
                ₹{totalCommitment.toLocaleString()}
              </div>
              <p className="text-[10px] mt-2 text-slate-400 font-medium">This amount will be settled upon farmer acceptance.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <HandCoins size={20} />}
              {loading ? "Confirming..." : "Submit Offer"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
            >
              Cancel Negotiation
            </button>
          </div>

          <div className="flex items-center gap-2 justify-center pt-2">
            <AlertCircle size={14} className="text-slate-300" />
            <p className="text-[10px] text-slate-400 font-medium">Offers cannot be retracted once accepted by the farmer.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BuyCropModal;