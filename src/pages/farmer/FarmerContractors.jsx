import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { searchContractors } from "../../api/farmerApi";
// SaaS Icons
import { 
  HardHat, 
  Search, 
  MapPin, 
  Briefcase, 
  Phone, 
  ShieldCheck, 
  Filter, 
  UserCheck,
  Loader2,
  Calendar
} from "lucide-react";

const FarmerContractors = () => {
  const [district, setDistrict] = useState("");
  const [workType, setWorkType] = useState("");
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!district || !workType) {
      alert("Please select both district and work type to find contractors.");
      return;
    }

    try {
      setLoading(true);
      const res = await searchContractors(district, workType);
      setContractors(res.data || []);
    } catch (error) {
      console.error("Search error:", error);
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
            <HardHat className="text-orange-500" /> Find Skilled Contractors
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Connect with verified labor and machinery providers in your region.</p>
        </div>

        {/* 🔹 Unified Search Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Enter District Name"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-5 relative group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" size={18} />
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Service Needed</option>
                <option value="HARVESTING">Harvesting Services</option>
                <option value="PLOUGHING">Ploughing & Tillage</option>
                <option value="SPRAYING">Pesticide Spraying</option>
                <option value="TRANSPORT">Crop Transportation</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="md:col-span-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? "Searching..." : "Find Now"}
            </button>
          </div>
        </div>

        {/* 🔹 Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-[2rem] animate-pulse" />)}
          </div>
        ) : contractors.length === 0 ? (
          <div className="py-24 text-center">
            <div className="bg-white p-8 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
               <Filter size={32} className="text-slate-200" />
            </div>
            <h3 className="text-slate-800 font-bold text-lg">No contractors matched your search</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Try selecting a different service or checking nearby districts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contractors.map((contractor) => (
              <div
                key={contractor.id}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden"
              >
                <div className="p-6">
                  {/* Status & Service Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      contractor.available 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      <UserCheck size={12} />
                      {contractor.available ? "Ready for Work" : "Currently Busy"}
                    </div>
                    {contractor.verified && (
                      <div className="text-blue-500" title="Verified Professional">
                        <ShieldCheck size={20} />
                      </div>
                    )}
                  </div>

                  {/* Name & Location */}
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-800 leading-tight mb-1 group-hover:text-green-700 transition-colors">
                      {contractor.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                      <MapPin size={12} /> {contractor.district}, {contractor.state}
                    </p>
                  </div>

                  {/* Service Specifics */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Specialization</p>
                       <p className="text-xs font-bold text-slate-700 truncate">{contractor.workType}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                       <p className="text-xs font-bold text-slate-700">Verified Partner</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <a 
                    href={`tel:${contractor.mobile}`}
                    className="w-full bg-slate-900 hover:bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                  >
                    <Phone size={18} /> 
                    <span>Call {contractor.mobile}</span>
                  </a>
                </div>
                
                {/* Decorative Timeline Stripe */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-300 opacity-20" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
           <div className="bg-white p-3 rounded-2xl text-blue-500 shadow-sm">
              <Calendar size={24} />
           </div>
           <div>
              <p className="font-bold text-blue-900">Advanced Booking</p>
              <p className="text-xs text-blue-700/70 font-medium">During peak harvesting seasons, we recommend calling contractors at least 3 days in advance.</p>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerContractors;