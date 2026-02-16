import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getAllTrades } from "../../api/adminApi";

const AdminTrades = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const res = await getAllTrades();
      setTrades(res.data);
    } catch (error) {
      console.error("Error fetching trades", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          All Trades
        </h1>

        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3">Crop Name</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Farmer</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {trades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {trade.crop?.cropName || "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    {trade.quantityQuintal || "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    ₹{trade.expectedRate || 0}
                  </td>

                  <td className="px-6 py-4">
                    {trade.farmer?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(
                        trade.status
                      )}`}
                    >
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {trades.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No trades found
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminTrades;
