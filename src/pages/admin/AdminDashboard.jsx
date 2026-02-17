import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAdminDashboard, getAdminAnalytics } from "../../api/adminApi";
// Icons add that A1 SaaS look
import { Users, Repeat, CreditCard, IndianRupee, TrendingUp, Sprout, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dashRes = await getAdminDashboard();
      const analyticsRes = await getAdminAnalytics();
      setDashboard(dashRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Overview</h1>
            <p className="text-slate-500">Monitoring the AgriSmart ecosystem metrics.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <BarChart3 size={16} /> Generate Report
          </button>
        </div>

        {/* 🔹 Primary Stats Grid */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Users */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
              <div className="absolute -right-2 -top-2 text-blue-50 opacity-50 group-hover:scale-110 transition-transform">
                <Users size={80} />
              </div>
              <div className="relative z-10">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit mb-4">
                  <Users size={20} />
                </div>
                <h2 className="text-slate-500 text-sm font-medium">Total Active Users</h2>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{dashboard.totalUsers}</p>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">+4.2%</span>
                </div>
              </div>
            </div>

            {/* Total Trades */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
              <div className="absolute -right-2 -top-2 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform">
                <Repeat size={80} />
              </div>
              <div className="relative z-10">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit mb-4">
                  <Repeat size={20} />
                </div>
                <h2 className="text-slate-500 text-sm font-medium">Platform Trades</h2>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{dashboard.totalTrades}</p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">High Vol</span>
                </div>
              </div>
            </div>

            {/* Total Payments */}
            <div className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
              <div className="absolute -right-2 -top-2 text-purple-50 opacity-50 group-hover:scale-110 transition-transform">
                <CreditCard size={80} />
              </div>
              <div className="relative z-10">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg w-fit mb-4">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-slate-500 text-sm font-medium">Total Transactions</h2>
                <p className="text-3xl font-bold text-slate-900">{dashboard.totalPayments}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🔹 Revenue Section */}
          <div className="lg:col-span-2 space-y-8">
            {dashboard?.totalRevenue && (
              <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-3xl p-8 text-white shadow-xl shadow-green-900/20 relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                      <IndianRupee size={18} />
                      <span className="text-sm font-medium uppercase tracking-wider">Gross Platform Revenue</span>
                    </div>
                    <p className="text-5xl font-black mb-6">₹{dashboard.totalRevenue.toLocaleString()}</p>
                    <div className="flex gap-4">
                       <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                          <p className="text-xs opacity-70">Current Month</p>
                          <p className="font-bold">₹{(dashboard.totalRevenue * 0.3).toFixed(0)}</p>
                       </div>
                       <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                          <p className="text-xs opacity-70">Projected Growth</p>
                          <p className="font-bold">+18%</p>
                       </div>
                    </div>
                 </div>
                 {/* Decorative background element */}
                 <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>
            )}

            {/* 🔹 Detailed Analytics Grid */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <Sprout size={20} />
                      </div>
                      <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Farmer Network</h3>
                   </div>
                   <p className="text-4xl font-bold text-slate-900">{analytics.totalFarmers}</p>
                   <p className="text-sm text-slate-500 mt-2">Registered farmers across all regions</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <TrendingUp size={20} />
                      </div>
                      <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Trade Volume</h3>
                   </div>
                   <p className="text-4xl font-bold text-slate-900">₹{analytics.totalTradeValue}</p>
                   <p className="text-sm text-slate-500 mt-2">Cumulative value of all marketplace trades</p>
                </div>
              </div>
            )}
          </div>

          {/* 🔹 Sidebar Analytics / Success Rates */}
          <div className="lg:col-span-1">
            {analytics && (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Efficiency Metrics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500 font-medium">Payment Success Rate</span>
                      <span className="text-emerald-600 font-bold">94%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[94%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Payment Breakdown</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Successful</span>
                        <span className="text-sm font-bold text-slate-900">{analytics.successfulPayments}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total Analytics Revenue</span>
                        <span className="text-sm font-bold text-blue-600">₹{analytics.totalRevenue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;