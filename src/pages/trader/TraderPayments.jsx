import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import {getTraderPayments} from "../../api/traderApi";

const TraderPayments = () => {

  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (traderId) fetchPayments();
  }, [traderId]);

  const fetchPayments = async () => {
    const res = await getTraderPayments(traderId);
    setPayments(res.data || []);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">
        My Payments
      </h1>

      {payments.map((p) => (
        <div key={p.id} className="bg-white p-5 shadow rounded mb-4">
          <p><b>Trade ID:</b> {p.traderId}</p>
          <p><b>Amount:</b> ₹ {p.amount}</p>
          <p><b>Status:</b> {p.status}</p>
        </div>
      ))}

    </DashboardLayout>
  );
};

export default TraderPayments;
