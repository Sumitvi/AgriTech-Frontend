import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getTraderPayments } from "../../api/traderApi";
// SaaS Icons
import { 
  CreditCard, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Receipt,
  Calendar,
  Loader2,
  Wallet
} from "lucide-react";

const TraderPayments = () => {
  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (traderId) fetchPayments();
  }, [traderId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getTraderPayments(traderId);
      setPayments(res.data || []);
    } catch (error) {
      console.error("Payment fetch error:", error);
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

  // Financial Calculations
  const totalPaid = payments
    .filter(p => p.status?.toUpperCase() === "SUCCESS")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* 🔹 Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <CreditCard className="text-blue-600" /> Payout History
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Detailed log of all farmer settlements and capital outflows.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Receipt size={18} /> Export CSV
          </button>
        </div>

        {/* 🔹 Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Settled</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-slate-900">₹{totalPaid.toLocaleString()}</span>
              <div className="bg-blue-100 text-blue-600 p-1 rounded-lg">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Processing</p>
            <span className="text-3xl font-black text-slate-900">
              {payments.filter(p => p.status?.toUpperCase() === "PENDING").length}
            </span>
          </div>
          <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl shadow-blue-200 text-white flex justify-between items-center overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">Account Balance</p>
              <p className="text-2xl font-black tracking-tight">Wallet Connected</p>
            </div>
            <Wallet size={48} className="opacity-20 absolute -right-2 -bottom-2" />
          </div>
        </div>

        {/* 🔹 Transaction Ledger */}
        <div className="space-y-4 max-w-5xl">
          <div className="flex items-center justify-between mb-4 ml-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Log</h3>
            <span className="text-[10px] font-bold text-slate-300 uppercase">{payments.length} Payments Found</span>
          </div>
          
          {loading ? (
             <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-[1.5rem] w-full" />)}
             </div>
          ) : payments.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
               <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <CreditCard size={32} />
               </div>
               <h3 className="text-slate-800 font-bold">No payments yet</h3>
               <p className="text-xs text-slate-400 max-w-xs mx-auto">Initiate a payment from your trade dashboard to see transaction records here.</p>
            </div>
          ) : (
            payments.map((p) => {
              const config = getStatusConfig(p.status);
              return (
                <div 
                  key={p.id} 
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="h-14 w-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shadow-inner">
                      <IndianRupee size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black text-slate-800 font-mono tracking-tighter">REF: #{p.id?.toString().slice(-8).toUpperCase()}</p>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Trade Transfer</span>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 font-bold uppercase tracking-tighter">
                        <Calendar size={12} /> Feb 17, 2026 • 1:47 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto md:gap-16 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                    <div className="text-right md:text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Disbursed Amount</p>
                      <p className="text-2xl font-black text-slate-900">₹{p.amount.toLocaleString()}</p>
                    </div>

                    <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.color}`}>
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

export default TraderPayments;