import { useForm } from "react-hook-form";
import { registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, Briefcase, Leaf, ArrowRight } from "lucide-react";

const Register = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden m-4">
        
        {/* Left Side: Brand Experience */}
        <div className="hidden lg:flex lg:w-2/5 bg-green-800 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg width="100%" height="100%"><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white" /></pattern><rect width="100%" height="100%" fill="url(#dots)" /></svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-10">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Leaf className="text-green-700" size={24} />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">AgriSmart</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Start your digital farming journey.</h2>
            <ul className="space-y-4">
              {['Real-time Crop Monitoring', 'Direct Market Access', 'Smart Inventory Management'].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-green-100">
                  <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-[10px] font-bold">✓</div>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 p-6 bg-green-900/40 border border-green-700/50 rounded-2xl backdrop-blur-sm">
            <p className="text-green-100 italic text-sm text-center">
              "This platform transformed how we track our soil health across 500 acres."
            </p>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="w-full lg:w-3/5 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
            <p className="text-slate-500 mt-2">Join the most advanced agritech ecosystem today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-green-600" size={18} />
                  <input
                    {...register("name")}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Mobile</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3 text-slate-400 group-focus-within:text-green-600" size={18} />
                  <input
                    {...register("mobile")}
                    placeholder="+91 00000 00000"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-green-600" size={18} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-green-600" size={18} />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Your Primary Role</label>
              <div className="relative group">
                <Briefcase className="absolute left-3 top-3 text-slate-400 group-focus-within:text-green-600" size={18} />
                <select
                  {...register("role")}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select your role</option>
                  <option value="ROLE_FARMER">Farmer</option>
                  <option value="ROLE_TRADER">Trader</option>
                  <option value="ROLE_STORE_OWNER">Store Owner</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Complete Registration"}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <a href="/login" className="font-bold text-green-600 hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;