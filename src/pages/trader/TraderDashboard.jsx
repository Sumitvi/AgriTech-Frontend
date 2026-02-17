import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getTraderTrades, getTraderPayments } from "../../api/traderApi";
// SaaS Icons & Visualization
import { 
  Package, 
  Gavel, 
  CreditCard, 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  BarChart3, 
  Activity,
  Clock
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const TraderDashboard = () => {
  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [stats, setStats] = useState({
    totalTrades: 0,
    pendingTrades: 0,
    totalPayments: 0,
    totalPurchaseValue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (traderId) fetchData();
  }, [traderId]);

  const fetchData = async () => {
    try {
      const [tradeRes, paymentRes] = await Promise.all([
        getTraderTrades(traderId),
        getTraderPayments(traderId)
      ]);

      const trades = tradeRes.data || [];
      const payments = paymentRes.data || [];

      const purchaseValue = trades.reduce(
        (sum, t) => sum + ((t.finalRate || t.expectedRate || 0) * (t.quantityQuintal || t.qty || 0)),
        0
      );

      setStats({
        totalTrades: trades.length,
        pendingTrades: trades.filter(t => t.status !== "COMPLETED" && t.status !== "PAID").length,
        totalPayments: payments.length,
        totalPurchaseValue: purchaseValue
      });

      // Prepare Chart Data (Procurement Value Trend)
      const mockTrend = trades.slice(-6).map((t, i) => ({
        name: `Trade ${i + 1}`,
        value: (t.finalRate || t.expectedRate || 0) * (t.quantityQuintal || t.qty || 0)
      }));
      setChartData(mockTrend);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="p-8 text-slate-400 animate-pulse font-bold tracking-widest uppercase text-xs">
        Syncing Market Terminal...
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trader Command Center</h1>
            <p className="text-slate-500 font-medium">Monitoring procurement volume and settlement cycles.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 text-xs font-bold">
            <Activity size={16} className="animate-pulse" /> LIVE EXCHANGE CONNECTED
          </div>
        </div>

        {/* 🔹 Metric Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Active Procurements" 
            value={stats.totalTrades} 
            icon={Package} 
            color="text-blue-600" 
            bg="bg-blue-50" 
          />
          <StatCard 
            title="Pending Settlement" 
            value={stats.pendingTrades} 
            icon={Clock} 
            color="text-amber-600" 
            bg="bg-amber-50" 
          />
          <StatCard 
            title="Total Disbursements" 
            value={stats.totalPayments} 
            icon={CreditCard} 
            color="text-emerald-600" 
            bg="bg-emerald-50" 
          />
          <StatCard 
            title="Procurement Value" 
            value={`₹${stats.totalPurchaseValue.toLocaleString()}`} 
            icon={IndianRupee} 
            color="text-slate-900" 
            bg="bg-white" 
            highlight 
          />
        </div>

        {/* 🔹 Visual Intelligence Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Purchase Volume Area Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="text-blue-500" /> Capital Deployment Trend
              </h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                Last 6 Trades
              </div>
            </div>
            
            

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                    formatter={(val) => [`₹${val.toLocaleString()}`, "Value"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🔹 Right Sidebar: Efficiency & Quick Actions */}
          <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-200">
               <div className="relative z-10">
                  <h4 className="text-xs font-bold opacity-60 uppercase tracking-[0.2em] mb-4">Liquidity Score</h4>
                  <p className="text-4xl font-black mb-2">94%</p>
                  <p className="text-xs text-slate-400 leading-relaxed">Your settlement cycle is 12% faster than the regional average.</p>
                  <button className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    Review Settlements <ArrowRight size={16} />
                  </button>
               </div>
               <TrendingUp className="absolute right-[-10%] bottom-[-10%] text-white/5" size={180} />
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Quick Insights</h4>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                     <p className="text-xs text-slate-500">Market rates for <span className="font-bold text-slate-700">Wheat</span> are up 4%</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="h-2 w-2 bg-blue-500 rounded-full" />
                     <p className="text-xs text-slate-500">New harvest listings in <span className="font-bold text-slate-700">Punjab</span> region</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bg, highlight }) => (
  <div className={`p-6 rounded-[2rem] border transition-all hover:shadow-md ${highlight ? 'bg-white border-blue-100 ring-4 ring-blue-50' : 'bg-white border-slate-100'}`}>
    <div className={`${bg} ${color} h-12 w-12 rounded-2xl flex items-center justify-center mb-4`}>
      <Icon size={24} />
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <h2 className={`text-2xl font-black ${highlight ? 'text-blue-600' : 'text-slate-900'}`}>{value}</h2>
  </div>
);

const ArrowRight = ({ size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default TraderDashboard;