import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import {
  getFarmerProfile,
  getFarmerLands,
  getFarmerCrops,
  getTradeHistory,
  getMyOrders
} from "../../api/farmerApi";

const FarmerDashboard = () => {

  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [profile, setProfile] = useState(null);
  const [lands, setLands] = useState([]);
  const [crops, setCrops] = useState([]);
  const [trades, setTrades] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (farmerId) fetchData();
  }, [farmerId]);

  const fetchData = async () => {
    try {
      const profileRes = await getFarmerProfile(farmerId);
      const landRes = await getFarmerLands(farmerId);
      const cropRes = await getFarmerCrops(farmerId);
      const tradeRes = await getTradeHistory(farmerId);
      const orderRes = await getMyOrders();

      setProfile(profileRes.data);
      setLands(landRes.data || []);
      setCrops(cropRes.data || []);
      setTrades(tradeRes.data || []);
      setOrders(orderRes.data || []);

    } catch (error) {
      console.error("Dashboard load error:", error);
    }
  };

  const activeCrops = crops.filter(
    (crop) => crop.status !== "HARVESTED"
  );

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Welcome, {profile?.name || "Farmer"}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-5 shadow rounded">
          <h3 className="text-gray-500 text-sm">
            Total Lands
          </h3>
          <p className="text-2xl font-bold">
            {lands.length}
          </p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h3 className="text-gray-500 text-sm">
            Active Crops
          </h3>
          <p className="text-2xl font-bold">
            {activeCrops.length}
          </p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h3 className="text-gray-500 text-sm">
            Total Trades
          </h3>
          <p className="text-2xl font-bold">
            {trades.length}
          </p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h3 className="text-gray-500 text-sm">
            Total Orders
          </h3>
          <p className="text-2xl font-bold">
            {orders.length}
          </p>
        </div>

      </div>

      {/* Profile Info */}
      {profile && (
        <div className="mt-8 bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold mb-4">
            Profile Overview
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Village:</strong> {profile.village}</p>
            <p><strong>District:</strong> {profile.district}</p>
            <p><strong>State:</strong> {profile.state}</p>
            <p><strong>Bank Account:</strong> {profile.bankAccount}</p>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default FarmerDashboard;
