import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAdminDashboard, getAdminAnalytics } from "../../api/adminApi";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dashRes = await getAdminDashboard();
      const analyticsRes = await getAdminAnalytics();

      setDashboard(dashRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">Loading Dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {/* 🔹 Stats Cards */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-gray-500 text-sm">Total Users</h2>
              <p className="text-2xl font-bold text-blue-600">
                {dashboard.totalUsers}
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-gray-500 text-sm">Total Trades</h2>
              <p className="text-2xl font-bold text-green-600">
                {dashboard.totalTrades}
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-gray-500 text-sm">Total Payments</h2>
              <p className="text-2xl font-bold text-purple-600">
                {dashboard.totalPayments}
              </p>
            </div>
          </div>
        )}

        {/* 🔹 Revenue Section (Optional if API provides) */}
        {dashboard?.totalRevenue && (
          <div className="bg-white shadow-md rounded-xl p-6 mb-8">
            <h2 className="text-gray-500 text-sm">Total Revenue</h2>
            <p className="text-3xl font-bold text-green-700">
              ₹ {dashboard.totalRevenue}
            </p>
          </div>
        )}

        {/* 🔹 Analytics Section */}
        {analytics && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Analytics Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Total Farmers</p>
                <p className="text-xl font-bold text-yellow-600">
                  {analytics.totalFarmers}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Total TradeValue</p>
                <p className="text-xl font-bold text-green-600">
                  {analytics.totalTradeValue}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Successful Payments</p>
                <p className="text-xl font-bold text-red-600">
                  {analytics.successfulPayments}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-xl font-bold text-blue-600">
                  {analytics.totalRevenue}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
