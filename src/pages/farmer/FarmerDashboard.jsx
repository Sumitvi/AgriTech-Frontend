import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import {
  getFarmerProfile,
  getFarmerLands,
  getFarmerCrops,
  getTradeHistory,
  getMyOrders
} from "../../api/farmerApi"; // Adjust to farmerApi if separate
// Icons & Charts
import { Map, Sprout, ShoppingBag, ArrowUpRight, Landmark, MapPin, User, Activity } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";

const FarmerDashboard = () => {
  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [profile, setProfile] = useState(null);
  const [lands, setLands] = useState([]);
  const [crops, setCrops] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmerId) fetchData();
  }, [farmerId]);

  const fetchData = async () => {
    try {
      const [profileRes, landRes, cropRes, tradeRes, orderRes] = await Promise.all([
        getFarmerProfile(farmerId),
        getFarmerLands(farmerId),
        getFarmerCrops(farmerId),
        getTradeHistory(farmerId),
        getMyOrders()
      ]);

      setProfile(profileRes.data);
      setLands(landRes.data || []);
      setCrops(cropRes.data || []);
      setTrades(tradeRes.data || []);
      setOrders(orderRes.data || []);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeCropsCount = crops.filter(c => c.status !== "HARVESTED").length;

  // Chart Data Preparation
  const cropData = [
    { name: 'Active', value: activeCropsCount },
    { name: 'Harvested', value: crops.length - activeCropsCount },
  ];
  const COLORS = ['#10b981', '#fbbf24'];

  const tradeData = trades.slice(-5).map(t => ({
    name: t.crop?.cropName || 'Trade',
    amount: t.expectedRate || 0
  }));

  if (loading) return <DashboardLayout><div className="p-8 animate-pulse text-slate-400">Syncing farm data...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Kisan Dashboard
            </h1>
            <p className="text-slate-500">Welcome back, <span className="text-green-600 font-bold">{profile?.name || "Farmer"}</span></p>
          </div>
          <div className="flex gap-2 text-xs font-bold text-slate-400 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <Activity size={16} className="text-green-500" />
            LIVE MARKET CONNECTED
          </div>
        </div>

        {/* 🔹 Summary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Lands", val: lands.length, icon: Map, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Crops", val: activeCropsCount, icon: Sprout, color: "text-green-600", bg: "bg-green-50" },
            { label: "Total Trades", val: trades.length, icon: ArrowUpRight, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "My Orders", val: orders.length, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 🔹 Visual Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ArrowUpRight className="text-green-500" /> Recent Trade Value
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tradeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Farmer Profile Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm"><MapPin size={18} className="text-green-600" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Region</p>
                      <p className="text-sm font-bold text-slate-700">{profile?.village}, {profile?.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm"><Landmark size={18} className="text-blue-600" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Settlement Bank</p>
                      <p className="text-sm font-bold text-slate-700">{profile?.bankAccount || "Not Linked"}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center md:items-end relative z-10">
                   <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl text-green-700 mb-2">
                      <User size={40} />
                   </div>
                   <p className="font-black text-slate-800 tracking-tighter uppercase text-xs">Verified Member</p>
                </div>
                {/* Abstract decoration */}
                <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-green-200/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>

          {/* 🔹 Sidebar Analytics */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">Crop Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {cropData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-3xl shadow-xl shadow-green-200 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="font-bold mb-1 opacity-80 text-xs uppercase tracking-widest">Soil Intelligence</h4>
                  <p className="text-lg font-medium leading-tight">Optimizing your <span className="font-black underline decoration-green-400">Nitrogen Levels</span> could increase yield by 12%.</p>
                  <button className="mt-4 text-xs font-bold bg-white text-green-700 px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all">
                    View Soil Report
                  </button>
               </div>
               <Sprout className="absolute bottom-[-10%] right-[-10%] opacity-10" size={120} />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;