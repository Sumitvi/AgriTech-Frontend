import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllPayments } from "../../api/adminApi";
// Professional SaaS Icon Set
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCcw, 
  Download,
  Calendar,
  IndianRupee,
  Hash,
  Search,
  Filter
} from "lucide-react";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getAllPayments();
      // Ensure we are setting an array even if API returns null
      setPayments(res.data || []);
    } catch (error) {
      console.error("Error fetching payments", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "completed":
        return { color: "text-emerald-700 bg-emerald-50 border-emerald-100", icon: <CheckCircle2 size={14} /> };
      case "pending":
        return { color: "text-amber-700 bg-amber-50 border-amber-100", icon: <Clock size={14} /> };
      case "failed":
        return { color: "text-rose-700 bg-rose-50 border-rose-100", icon: <AlertCircle size={14} /> };
      case "refunded":
        return { color: "text-blue-700 bg-blue-50 border-blue-100", icon: <RefreshCcw size={14} /> };
      default:
        return { color: "text-slate-600 bg-slate-50 border-slate-100", icon: null };
    }
  };

  const getMethodIcon = (method) => {
    const m = String(method || "").toLowerCase();
    if (m.includes("upi") || m.includes("phone") || m.includes("gpay")) return <Smartphone size={16} className="text-purple-500" />;
    if (m.includes("card")) return <CreditCard size={16} className="text-blue-500" />;
    return <Banknote size={16} className="text-green-500" />;
  };

  // Loading State Skeleton
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-slate-200 w-1/4 mb-8 rounded"></div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="h-24 bg-slate-200 rounded-2xl"></div>
            <div className="h-24 bg-slate-200 rounded-2xl"></div>
            <div className="h-24 bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payment Ledger</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitoring financial transactions within the Agritech ecosystem.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={18} /> Filters
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-200 active:scale-95">
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={48} className="text-emerald-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-slate-900 leading-none">
              ₹ {payments.filter(p => p.status?.toLowerCase() === 'success' || p.status?.toLowerCase() === 'completed')
                  .reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Clock size={48} className="text-amber-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Volume</p>
            <p className="text-3xl font-black text-slate-900 leading-none">
              ₹ {payments.filter(p => p.status?.toLowerCase() === 'pending')
                  .reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Hash size={48} className="text-blue-600" />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Transactions</p>
            <p className="text-3xl font-black text-slate-900 leading-none">{payments.length}</p>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Method</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Date & Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => {
                  const config = getStatusConfig(p.status);
                  const paymentIdString = String(p.id || ""); // Fix for the .slice() error
                  
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 mb-1">
                            <Hash size={10} /> {paymentIdString.slice(0, 12).toUpperCase()}{paymentIdString.length > 12 ? "..." : ""}
                          </span>
                          <span className="text-sm font-semibold text-slate-700">
                            Trade Ref: <span className="text-blue-600 font-bold">#{p.trade?.id || "N/A"}</span>
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center text-lg font-black text-slate-900">
                          <IndianRupee size={16} className="text-slate-400" />
                          {(p.amount || 0).toLocaleString()}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 capitalize">
                          {getMethodIcon(p.method)}
                          {p.method || "N/A"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}>
                          {config.icon}
                          {p.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col text-xs font-medium text-slate-500">
                          <span className="flex items-center justify-end gap-1 font-bold text-slate-700">
                            <Calendar size={12} /> {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
                          </span>
                          <span>{p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && payments.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-4 border-2 border-dashed border-slate-200">
                <IndianRupee size={32} className="text-slate-200" />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">No payments recorded</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">All transactions from the marketplace will be logged here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPayments;