import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getSchemesForFarmer } from "../../api/farmerApi";
// SaaS Icons
import { 
  Landmark, 
  Search, 
  MapPin, 
  Sprout, 
  ExternalLink, 
  Gift, 
  FileText, 
  Loader2,
  Info
} from "lucide-react";

const FarmerSchemes = () => {
  const [state, setState] = useState("");
  const [crop, setCrop] = useState("");
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await getSchemesForFarmer({ state, crop });
      setSchemes(res.data || []);
    } catch (error) {
      console.error("Scheme error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        
        {/* 🔹 Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Landmark className="text-green-700" /> Welfare & Subsidies
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Find personalized government support schemes based on your region and crops.</p>
        </div>

        {/* 🔹 Command Search Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
              <input
                placeholder="Enter State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-5 relative group">
              <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
              <input
                placeholder="Enter Crop Name"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="md:col-span-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? "Finding..." : "Search Schemes"}
            </button>
          </div>
        </div>

        {/* 🔹 Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-[2rem] animate-pulse" />)}
          </div>
        ) : schemes.length === 0 ? (
          <div className="py-24 text-center">
            <div className="bg-white p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
               <FileText size={32} className="text-slate-200" />
            </div>
            <h3 className="text-slate-800 font-bold text-lg">No matching schemes found</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Try entering your state or crop to see available government benefits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-[2rem] border-t-4 border-t-green-600 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group flex flex-col"
              >
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-green-50 text-green-700 rounded-2xl shadow-inner">
                      <Landmark size={24} />
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                      Govt. Policy
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 leading-tight mb-3 group-hover:text-green-700 transition-colors">
                    {scheme.schemeName}
                  </h3>
                  
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3 italic">
                    "{scheme.description}"
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <Gift className="text-amber-500 shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Benefit</p>
                      <p className="text-sm font-black text-green-700">{scheme.benefit}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-50">
                  <a
                    href={scheme.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-900 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                  >
                    Apply Now <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Bottom Info Card */}
        {!loading && schemes.length > 0 && (
          <div className="mt-12 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex flex-col md:flex-row items-center gap-4">
             <div className="bg-white p-3 rounded-2xl text-amber-500 shadow-sm">
                <Info size={24} />
             </div>
             <div>
                <p className="font-bold text-amber-900">Eligibility Notice</p>
                <p className="text-xs text-amber-800/70 font-medium">Please ensure your Aadhaar and Bank details are updated in your profile to avoid rejection of scheme benefits.</p>
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerSchemes;