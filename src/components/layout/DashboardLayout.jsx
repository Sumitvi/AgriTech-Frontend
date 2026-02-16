import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);

  const role = user?.role?.replace("ROLE_", "");

  return (
    <div className="flex">
      <Sidebar role={role} />

      <div className="flex-1">
        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
