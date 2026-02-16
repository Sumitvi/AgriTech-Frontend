import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center bg-white shadow p-4">
      <h3 className="font-semibold">
        Welcome {user?.sub || "User"}
      </h3>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
