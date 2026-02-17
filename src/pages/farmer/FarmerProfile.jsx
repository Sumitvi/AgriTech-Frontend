import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import {
  getFarmerProfile,
  updateFarmerProfile
} from "../../api/farmerApi";
// SaaS Icons
import { 
  User, 
  CreditCard, 
  MapPin, 
  ShieldCheck, 
  Landmark, 
  Fingerprint, 
  Save, 
  BadgeCheck 
} from "lucide-react";

const FarmerProfile = () => {
  const { user } = useContext(AuthContext);
  
  // Logic: Ensure we have a valid string for the ID to prevent .slice errors
  const farmerId = user?.userId || ""; 

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  // Logic: Only fetch if farmerId is available
  useEffect(() => {
    if (farmerId) {
      fetchProfile();
    }
  }, [farmerId]);

  const fetchProfile = async () => {
    try {
      const res = await getFarmerProfile(farmerId);
      setForm(res.data || {});
    } catch (err) {
      console.error("Profile Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await updateFarmerProfile(farmerId, form);
      alert("Profile Updated Successfully ✅");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="p-8 text-slate-400 animate-pulse font-bold uppercase tracking-widest text-xs">
        Syncing Profile...
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-xl shadow-green-200">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">My Profile</h1>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <BadgeCheck size={12} /> Verified Member
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-tight">
                  Farmer ID: #{String(farmerId).slice(-6) || "------"}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-slate-900 hover:bg-green-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
          >
            <Save size={18} /> Save Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 🔹 Identity & Banking Section */}
          <div className="lg:col-span-8 space-y-8">
            {/* Identity Card */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-500" size={20} /> Identity Verification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Aadhaar Number</label>
                  <div className="relative">
                    <Fingerprint size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      name="aadhaarNumber"
                      value={form.aadhaarNumber || ""}
                      onChange={handleChange}
                      placeholder="12-digit Aadhaar"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Banking Card */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Landmark className="text-amber-500" size={20} /> Bank Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      name="bankAccount"
                      value={form.bankAccount || ""}
                      onChange={handleChange}
                      placeholder="Bank Account Number"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                  <input
                    name="ifscCode"
                    value={form.ifscCode || ""}
                    onChange={handleChange}
                    placeholder="BANK0123456"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 Location Section (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MapPin className="text-rose-500" size={20} /> Residency
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Village</label>
                  <input
                    name="village"
                    value={form.village || ""}
                    onChange={handleChange}
                    placeholder="Enter Village"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">District</label>
                  <input
                    name="district"
                    value={form.district || ""}
                    onChange={handleChange}
                    placeholder="District"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">State</label>
                  <input
                    name="state"
                    value={form.state || ""}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerProfile;