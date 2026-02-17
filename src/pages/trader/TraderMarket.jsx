import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMandiPrices, getMSP } from "../../api/traderApi";
// SaaS Icons & Visualization
import { 
  BarChart3, 
  Search, 
  MapPin, 
  Sprout, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Loader2,
  AlertCircle,
  Landmark
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const TraderMarket = () => {
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [prices, setPrices] = useState([]);
  const [msp, setMsp] = useState(null);
  const [mspError, setMspError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!crop || !state) {
      alert("Please enter both crop and state for accurate analysis.");
      return;
    }

    try {
      setLoading(true);
      setMsp(null);
      setMspError("");

      // Fetch Mandi prices
      const mandiRes = await getMandiPrices({ cropName: crop, state: state });
      setPrices(mandiRes.data || []);

      // Fetch MSP separately
      try {
        const mspRes = await getMSP({ cropName: crop });
        setMsp(mspRes.data);
      } catch (err) {
        setMsp(null);
        setMspError("MSP data not available for this crop.");
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logic: Calculate average mandi price for chart
  const avgMandiPrice = prices.length > 0 
    ? prices.reduce((acc, curr) => acc + curr.modalPrice, 0) / prices.length 
    : 0;

  const chartData = msp ? [
    { name: 'Govt MSP', price: msp.mspPrice, color: '#3b82f6' },
    { name: 'Avg Mandi', price: avgMandiPrice, color: '#10b981' }
  ] : [];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* 🔹 Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-blue-600" /> Market Intelligence
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Analyze regional Mandi variations against the Minimum Support Price.</p>
        </div>

        {/* 🔹 Command Search Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 relative group">
              <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                placeholder="Enter Crop (e.g. Wheat)"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-4 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                placeholder="Enter State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="md:col-span-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? "Analyzing..." : "Analyze Markets"}
            </button>
          </div>
        </div>

        {loading ? (
           <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-bold uppercase tracking-widest text-xs">Accessing Mandi Database...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 🔹 Left: MSP & Analytics (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {msp ? (
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                        <Landmark size={20} className="text-blue-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Official Support Price</span>
                    </div>
                    
                    <h2 className="text-5xl font-black mb-2 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-400">₹</span>{msp.mspPrice}
                    </h2>
                    <p className="text-sm text-slate-400 font-medium italic">Fixed MSP for {crop} (2025-26 Season)</p>

                    <div className="mt-8 h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" hide />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', color: '#000'}} />
                          <Bar dataKey="price" radius={[8, 8, 8, 8]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <Landmark className="absolute right-[-10%] bottom-[-10%] opacity-5" size={200} />
                </div>
              ) : (
                <div className="bg-white p-8 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                   <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
                   <p className="text-slate-400 font-bold">{mspError || "Search a crop to view MSP comparison"}</p>
                </div>
              )}
            </div>

            {/* 🔹 Right: Mandi Variations (7 cols) */}
            <div className="lg:col-span-7">
               <div className="space-y-4">
                  <div className="flex items-center justify-between ml-2 mb-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Regional Variations</h3>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{prices.length} Mandis Reporting</span>
                  </div>

                  {prices.map((p, i) => {
                    const isProfitable = msp ? p.modalPrice > msp.mspPrice : false;
                    return (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mandi Location</p>
                            <h4 className="font-black text-slate-800 text-lg leading-tight">{p.mandiName}</h4>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-6">
                           <div className="hidden sm:block">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">vs. MSP</p>
                              <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                isProfitable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                              }`}>
                                {isProfitable ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {isProfitable ? 'Above' : 'Below'}
                              </div>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mandi Rate</p>
                              <p className="text-xl font-black text-slate-900 flex items-center gap-0.5">
                                <IndianRupee size={16} className="text-slate-400" /> {p.modalPrice.toLocaleString()}
                              </p>
                           </div>
                        </div>
                      </div>
                    );
                  })}

                  {prices.length === 0 && !loading && (
                    <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                      <BarChart3 size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold">No Mandi data found for this selection.</p>
                      <p className="text-xs text-slate-300">Try searching for major crops like Wheat or Paddy.</p>
                    </div>
                  )}
               </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TraderMarket;