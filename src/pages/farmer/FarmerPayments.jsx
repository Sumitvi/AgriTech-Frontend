import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getFarmerPayments } from "../../api/farmerApi";
// SaaS Icons
import { 
  IndianRupee, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Receipt,
  Search,
  Calendar
} from "lucide-react";

const FarmerPayments = () => {
  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmerId) fetchPayments();
  }, [farmerId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getFarmerPayments(farmerId);
      setPayments(res.data || []);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
      case "COMPLETED":
        return { color: "text-emerald-700 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 size={14} /> };
      case "PENDING":
      case "PROCESSING":
        return { color: "text-amber-700 bg-amber-50 border-amber-100", icon: <Clock size={14} /> };
      case "FAILED":
        return { color: "text-rose-700 bg-rose-50 border-rose-100", icon: <AlertCircle size={14} /> };
      default:
        return { color: "text-slate-600 bg-slate-50 border-slate-100", icon: null };
    }
  };

  // Logic for Financial Summary
  const totalEarnings = payments
    .filter(p => p.status?.toUpperCase() === "SUCCESS")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <CreditCard className="text-green-600" /> Payment Ledger
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Monitor your earnings, trade settlements, and payout status.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Receipt size={18} /> Export Statement
          </button>
        </div>

        {/* 🔹 Financial Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Settled</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-slate-900">₹{totalEarnings.toLocaleString()}</span>
              <div className="bg-green-100 text-green-700 p-1 rounded-lg">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Payouts</p>
            <span className="text-3xl font-black text-slate-900">
              {payments.filter(p => p.status?.toUpperCase() === "PENDING").length}
            </span>
          </div>
          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Wallet Status</p>
            <p className="text-xl font-bold">Verified & Linked</p>
            <p className="text-[10px] opacity-60 mt-2 flex items-center gap-1">
              <CheckCircle2 size={12} /> Auto-settlement active
            </p>
          </div>
        </div>

        {/* 🔹 Transaction List */}
        <div className="space-y-4 max-w-5xl">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Recent Transactions</h3>
          
          {loading ? (
             <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-2xl w-full" />)}
             </div>
          ) : payments.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
               <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndianRupee size={24} className="text-slate-200" />
               </div>
               <p className="text-slate-500 font-bold">No payments recorded yet.</p>
               <p className="text-xs text-slate-400">Earnings from trades will appear here automatically.</p>
            </div>
          ) : (
            payments.map((p) => {
              const config = getStatusConfig(p.status);
              return (
                <div 
                  key={p.id} 
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                      <IndianRupee size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">Trade ID: #{p.tradeId}</p>
                        <span className="text-[10px] text-slate-400 font-medium">| Bank Transfer</span>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-bold uppercase">
                        <Calendar size={12} /> Feb 17, 2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-12">
                    <div className="text-right md:text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                      <p className="text-lg font-black text-slate-900">₹{p.amount.toLocaleString()}</p>
                    </div>

                    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
                      {config.icon}
                      {p.status}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerPayments;