import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getTraderTrades, initiatePayment } from "../../api/traderApi";

const TraderTrades = () => {

  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (traderId) fetchTrades();
  }, [traderId]);

  const fetchTrades = async () => {
    try {
      const res = await getTraderTrades(traderId);
      setTrades(res.data || []);
    } catch (error) {
      console.error("Trade fetch error:", error);
    }
  };

  const handlePayment = async (trade) => {
    const rateToUse = trade.finalRate ?? trade.expectedRate;

    const payload = {
      tradeId: trade.id,
      amount: (rateToUse || 0) * (trade.quantityQuintal || 0),
    };

    try {
      await initiatePayment(payload);
      alert("Payment initiated successfully");
      fetchTrades();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          📦 My Trades
        </h1>

        {trades.length === 0 ? (
          <p>No trades found.</p>
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {trades.map((trade) => (
              <div
                key={trade.id}
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <p><b>Crop:</b> {trade.crop?.cropName}</p>
                <p><b>Farmer:</b> {trade.farmer?.name}</p>
                <p><b>Quantity:</b> {trade.quantityQuintal} Quintal</p>
                <p><b>Rate:</b> ₹ {trade.finalRate ?? trade.expectedRate}</p>
                <p><b>Status:</b> {trade.status}</p>

                {/* 🔥 Updated Condition */}
                {(trade.status === "SOLD" || trade.status === "ACCEPTED") && (
                  <button
                    onClick={() => handlePayment(trade)}
                    style={{
                      marginTop: "10px",
                      padding: "8px 15px",
                      backgroundColor: "#2563eb",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Pay Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TraderTrades;
