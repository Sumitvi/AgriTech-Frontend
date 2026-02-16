import { NavLink } from "react-router-dom";
import { menuConfig } from "../../config/menuConfig";

const Sidebar = ({ role }) => {
  const menus = menuConfig[role] || [];

  return (
    <div className="w-64 bg-green-700 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-6">Accurate Farming</h2>

      {menus.map((menu) => (
        <NavLink
          key={menu.path}
          to={menu.path}
          className={({ isActive }) =>
            `block p-2 rounded mb-2 ${
              isActive ? "bg-white text-green-700" : ""
            }`
          }
        >
          {menu.name}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
