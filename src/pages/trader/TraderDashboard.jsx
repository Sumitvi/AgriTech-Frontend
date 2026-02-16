import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
// import { getTraderTrades, getTraderPayments } from "../../api/tradeApi";
import { AuthContext } from "../../context/AuthContext";
import { getTraderTrades } from "../../api/traderApi";
import { getTraderPayments } from "../../api/traderApi";

const TraderDashboard = () => {

  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [stats, setStats] = useState({
    totalTrades: 0,
    pendingTrades: 0,
    totalPayments: 0,
    totalPurchaseValue: 0
  });

  useEffect(() => {
    if (traderId) fetchData();
  }, [traderId]);

  const fetchData = async () => {

    const tradeRes = await getTraderTrades(traderId);
    const paymentRes = await getTraderPayments(traderId);

    const trades = tradeRes.data || [];
    const payments = paymentRes.data || [];

    setStats({
      totalTrades: trades.length,
      pendingTrades: trades.filter(t => t.status !== "COMPLETED").length,
      totalPayments: payments.length,
      totalPurchaseValue: trades.reduce(
        (sum, t) => sum + ((t.rate || 0) * (t.qty || 0)),
        0
      )
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">
        Trader Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <Card title="Total Trades" value={stats.totalTrades} />
        <Card title="Pending Trades" value={stats.pendingTrades} />
        <Card title="Total Payments" value={stats.totalPayments} />
        <Card title="Purchase Value" value={`₹ ${stats.totalPurchaseValue}`} />

      </div>

    </DashboardLayout>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow rounded p-5">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default TraderDashboard;
