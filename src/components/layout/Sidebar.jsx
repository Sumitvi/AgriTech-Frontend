import { useEffect, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { menuConfig } from "../../config/menuConfig";
import { AuthContext } from "../../context/AuthContext";
import { X, Leaf, LogOut, ChevronRight, User } from "lucide-react";

const Sidebar = ({ role, isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();


  const menus = menuConfig[role] || 
                menuConfig[`ROLE_${role}`] || 
                menuConfig[role?.replace("ROLE_", "")] || 
                [];

  useEffect(() => {
    setIsOpen(false);
  }, [location, setIsOpen]);

  return (
    <>
      {/* 🔹 Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 🔹 Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-green-950 text-slate-100 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col shadow-2xl lg:shadow-none h-screen shrink-0
      `}>
        
        {/* Brand Header */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2.5 rounded-2xl shadow-lg shadow-green-500/20 ring-4 ring-green-500/10">
              <Leaf className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-white leading-none">AgriSmart</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-green-400 font-bold mt-1"> Panel</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-green-300 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">Operations</p>
          
          {menus.length > 0 ? menus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) => `
                group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
                ${isActive 
                  ? "bg-green-600 text-white shadow-xl shadow-green-900/40 ring-1 ring-white/20" 
                  : "text-green-100/60 hover:bg-green-900/50 hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {menu.icon && <menu.icon size={20} className="group-hover:scale-110 transition-transform" />}
                <span className="text-sm font-medium">{menu.name}</span>
              </div>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </NavLink>
          )) : (
            <div className="px-4 py-2 text-xs text-green-700 italic">
              No menu items found for role: {role}
            </div>
          )}
        </nav>

        {/* Footer: Profile & Logout */}
        <div className="p-4 mt-auto">
          <div className="bg-green-900/40 border border-green-800/50 rounded-[2rem] p-4 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center shadow-lg border border-white/10">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate capitalize">
                  {user?.name || "Member User"}
                </p>
                <p className="text-[10px] text-green-400 font-bold truncate uppercase tracking-tighter">
                  {role?.replace("ROLE_", "") || ""}
                </p>
              </div>
            </div>

            <button 
              onClick={logout}
              className="group w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-xs font-black transition-all duration-300 border border-red-500/20 hover:shadow-lg hover:shadow-red-500/40 active:scale-95"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out Securely
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;