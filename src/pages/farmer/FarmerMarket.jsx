import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMarketPrices, getMSP } from "../../api/farmerApi";
// SaaS Icons & Visualization
import { Search, IndianRupee, TrendingUp, TrendingDown, Info, Landmark, Store, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const FarmerMarket = () => {
  const [cropName, setCropName] = useState("");
  const [state, setState] = useState("UP");
  const [marketData, setMarketData] = useState(null);
  const [mspData, setMspData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!cropName) {
      alert("Please enter a crop name");
      return;
    }
    try {
      setLoading(true);
      const [marketRes, mspRes] = await Promise.all([
        getMarketPrices({ cropName, state }),
        getMSP(cropName)
      ]);
      setMarketData(marketRes.data);
      setMspData(mspRes.data);
    } catch (error) {
      alert("No data found for this selection");
    } finally {
      setLoading(false);
    }
  };

  // Chart Data Preparation
  const chartData = marketData && mspData ? [
    { name: 'Mandi Price', price: marketData.modalPrice, fill: '#10b981' },
    { name: 'Govt MSP', price: mspData.mspPrice, fill: '#3b82f6' }
  ] : [];

  const isMarketHigher = marketData?.modalPrice > mspData?.mspPrice;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-green-600" /> Price Intelligence
          </h1>
          <p className="text-slate-500 mt-1">Compare local Mandi rates with Government Minimum Support Prices.</p>
        </div>

        {/* 🔹 Search Toolbar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600" size={18} />
              <input
                placeholder="Search Crop (e.g. Wheat, Paddy)"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-4 relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 outline-none appearance-none cursor-pointer"
              >
                <option value="UP">Uttar Pradesh</option>
                <option value="MP">Madhya Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="md:col-span-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? "Analyzing..." : "Check Prices"}
            </button>
          </div>
        </div>

        {marketData && mspData ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 🔹 Price Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mandi Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Store size={24} /></div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">State Mandi Rate</p>
                    <p className="text-sm font-bold text-slate-700">{marketData.state}</p>
                  </div>
                </div>
                <h3 className="text-slate-500 font-semibold mb-1">Local Market Price</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{marketData.modalPrice}</span>
                  <span className="text-slate-400 font-bold text-xs uppercase">/Quintal</span>
                </div>
                <div className="absolute right-[-5%] bottom-[-5%] opacity-5 group-hover:scale-110 transition-transform"><Store size={120} /></div>
              </div>

              {/* MSP Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Landmark size={24} /></div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fixed by GOI</p>
                    <p className="text-sm font-bold text-slate-700">Central MSP</p>
                  </div>
                </div>
                <h3 className="text-slate-500 font-semibold mb-1">Govt. Support Price</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{mspData.mspPrice}</span>
                  <span className="text-slate-400 font-bold text-xs uppercase">/Quintal</span>
                </div>
                <div className="absolute right-[-5%] bottom-[-5%] opacity-5 group-hover:scale-110 transition-transform"><Landmark size={120} /></div>
              </div>
            </div>

            {/* 🔹 Visual Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Gap Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                   Price Gap Analysis
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={0} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="price" radius={[0, 10, 10, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 🔹 Actionable Insight */}
              <div className={`p-8 rounded-[2.5rem] border flex flex-col justify-between transition-all shadow-xl ${
                isMarketHigher 
                ? 'bg-emerald-600 border-emerald-500 shadow-emerald-100 text-white' 
                : 'bg-amber-600 border-amber-500 shadow-amber-100 text-white'
              }`}>
                <div>
                  <div className="bg-white/20 p-3 rounded-2xl w-fit mb-6 backdrop-blur-md">
                    {isMarketHigher ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  </div>
                  <h3 className="text-2xl font-black mb-4 leading-tight">
                    {isMarketHigher ? "Optimal Market Condition" : "Sub-Optimal Market Price"}
                  </h3>
                  <p className="opacity-90 text-sm font-medium leading-relaxed">
                    {isMarketHigher 
                      ? `Market price is ₹${marketData.modalPrice - mspData.mspPrice} higher than MSP. You will earn more by selling at the Mandi today.`
                      : `Mandi price is lower than MSP. We suggest selling via Government Procurement centers to secure the MSP rate.`
                    }
                  </p>
                </div>
                
                <button className="mt-8 w-full py-4 bg-white rounded-2xl font-bold text-slate-900 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Info size={16} /> View Nearby Centers
                </button>
              </div>
            </div>
          </div>
        ) : !loading && (
          <div className="py-24 text-center">
             <div className="bg-white p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <IndianRupee size={32} className="text-slate-200" />
             </div>
             <h3 className="text-slate-800 font-bold text-lg">No comparison data yet</h3>
             <p className="text-slate-400 text-sm max-w-xs mx-auto">Select a crop and state above to begin your market intelligence report.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerMarket;