import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Menu, Bell, Settings, HelpCircle } from "lucide-react";

const Navbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);

    console.log(user)

  return (
    <div className="h-20 bg-white border-b border-slate-100 flex justify-between items-center px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* 🔹 Hamburger Menu: Only visible on mobile/tablet */}
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div>
           {/* <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal / Admin</p> */}
           <h3 className="font-bold text-slate-800">Welcome to AgriSmart</h3>
         
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:text-green-600"><Bell size={20} /></button>
        <button className="p-2 text-slate-400 hover:text-slate-600"><Settings size={20} /></button>
      </div>
    </div>
  );
};

export default Navbar;