import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getFarmerPayments } from "../../api/farmerApi";

const FarmerPayments = () => {

  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (farmerId) fetchPayments();
  }, [farmerId]);

  const fetchPayments = async () => {
    try {
      const res = await getFarmerPayments(farmerId);
      setPayments(res.data || []);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">
        My Payments
      </h2>

      <div className="space-y-4">
        {payments.map((p) => (
          <div key={p.id} className="bg-white shadow p-4 rounded">
            <p>Trade ID: {p.tradeId}</p>
            <p>Amount: ₹{p.amount}</p>
            <p>Status: {p.status}</p>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
};

export default FarmerPayments;
