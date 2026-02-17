import { useState, useContext } from "react";
import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// Tip: Install 'lucide-react' for these icons, or swap for SVG
import { Leaf, Phone, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, getDefaultRoute } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ mobile, password });
      const token = res.data.token;
      login(token);
      const decoded = jwtDecode(token);
      const redirectPath = getDefaultRoute(decoded.role);
      navigate(redirectPath);
    } catch (error) {
      alert("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      {/* Main Container */}
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden m-4">
        
        {/* Left Side: Branding/Visual (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-green-700 p-12 flex-col justify-between relative overflow-hidden">
          {/* Abstract Pattern Background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white p-2 rounded-lg">
                <Leaf className="text-green-700" size={24} />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">AgriSmart</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Cultivating the <br /> 
              <span className="text-green-300">future of farming.</span>
            </h1>
            <p className="text-green-100 mt-4 text-lg max-w-xs">
              Manage your fields, monitor crop health, and optimize yields in one unified dashboard.
            </p>
          </div>

          <div className="relative z-10 text-green-200 text-sm">
            © 2026 AgriSmart SaaS • Precision Agriculture
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to access your farm.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mobile Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mobile Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your registered mobile"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-green-600 hover:text-green-700">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <a href="/register" className="font-bold text-green-600 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;