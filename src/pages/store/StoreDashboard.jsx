import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
// SaaS Icons & Charts
import { 
  Package, ShoppingCart, Truck, IndianRupee, TrendingUp, 
  ArrowUpRight, BarChart3, PieChart as PieIcon, Activity 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";

const StoreDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    shippedOrders: 0,
    revenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productRes = await axiosInstance.get("/store/my-products");
      const orderRes = await axiosInstance.get("/orders/store");

      const productsData = productRes.data || [];
      const ordersData = orderRes.data || [];

      calculateStats(productsData, ordersData);
      prepareChartData(ordersData);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (products, orders) => {
    const revenue = orders
      .filter(o => o.status === "DELIVERED")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    setStats({
      totalProducts: products.length,
      activeOrders: orders.filter(o => o.status === "PLACED").length,
      shippedOrders: orders.filter(o => o.status === "SHIPPED").length,
      revenue
    });
  };

  const prepareChartData = (orders) => {
    // Preparing dummy time-series data based on delivered orders
    const delivered = orders.filter(o => o.status === "DELIVERED");
    const data = delivered.map((o, i) => ({
      name: `Order ${i + 1}`,
      val: o.totalAmount,
    })).slice(-6); // Last 6 sales
    setChartData(data);
  };

  const pieData = [
    { name: 'Pending', value: stats.activeOrders, color: '#fbbf24' },
    { name: 'Shipped', value: stats.shippedOrders, color: '#3b82f6' },
  ];

  if (loading) return <DashboardLayout><div className="p-8 animate-pulse text-slate-400">Loading business metrics...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Store Overview</h1>
            <p className="text-slate-500 font-medium">Monitoring sales performance and logistics.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-bold">
            <TrendingUp size={16} /> REVENUE UP 12% THIS WEEK
          </div>
        </div>

        {/* 🔹 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Inventory Items", val: stats.totalProducts, icon: Package, color: "text-slate-600", bg: "bg-slate-100" },
            { label: "New Orders", val: stats.activeOrders, icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "In Transit", val: stats.shippedOrders, icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Revenue", val: `₹${stats.revenue.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
              <div className={`${item.bg} ${item.color} h-12 w-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
              <h2 className="text-2xl font-black text-slate-900 mt-1">{item.val}</h2>
            </div>
          ))}
        </div>

        {/* 🔹 Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Area Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="text-emerald-500" /> Recent Sales Performance
              </h3>
              <select className="text-xs font-bold bg-slate-50 border-none rounded-lg focus:ring-0">
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="val" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Logistics Pie Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Activity className="text-blue-500" /> Fulfillment
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="text-center p-3 bg-amber-50 rounded-2xl">
                   <p className="text-[10px] font-bold text-amber-600 uppercase">Pending</p>
                   <p className="text-lg font-black">{stats.activeOrders}</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-2xl">
                   <p className="text-[10px] font-bold text-blue-600 uppercase">Shipped</p>
                   <p className="text-lg font-black">{stats.shippedOrders}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Bottom Section: Inventory Warning */}
        <div className="mt-8 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                   <Package size={32} className="text-emerald-400" />
                </div>
                <div>
                   <h4 className="text-xl font-bold">Inventory Intelligence</h4>
                   <p className="text-slate-400 text-sm">3 products are currently low on stock. Restock soon to maintain sales.</p>
                </div>
              </div>
              <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-3 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                 Manage Catalog
              </button>
           </div>
           <ArrowUpRight className="absolute right-[-2%] bottom-[-10%] text-white/5" size={200} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoreDashboard;