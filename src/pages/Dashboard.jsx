import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome {user?.sub}
      </h1>

      <p className="mt-3">
        Role: {user?.role}
      </p>
    </div>
  );
};

export default Dashboard;
