import { useEffect, useState, useContext } from "react";
import { getListedTrades, buyCrop } from "../../api/traderApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";

const TraderMarketplace = () => {
  const { user } = useContext(AuthContext);   // ✅ get logged-in user
  const traderId = user?.userId;              // ✅ real trader id

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const res = await getListedTrades();
      setTrades(res.data || []);
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (trade) => {
    if (!traderId) {
      alert("Trader not logged in properly.");
      return;
    }

    try {
      const payload = {
        tradeId: trade.id,
        traderId: traderId,          // ✅ REAL trader id
        offeredRate: trade.expectedRate,
      };

      console.log("Buying as trader:", traderId);

      await buyCrop(payload);

      alert("Trade bought successfully");

      fetchTrades(); // refresh marketplace
    } catch (error) {
      console.error("Buy error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          🛒 Crop Marketplace
        </h1>

        {loading ? (
          <p>Loading listed crops...</p>
        ) : trades.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p>No crops available for purchase.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {trades.map((trade) => (
              <div
                key={trade.id}
                style={{
                  background: "#ffffff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>
                    🌾 {trade.cropName}
                  </h3>

                  <p><strong>Quantity:</strong> {trade.quantityQuintal} Quintal</p>
                  <p><strong>Expected Rate:</strong> ₹{trade.expectedRate}</p>
                  <p><strong>Status:</strong> {trade.status}</p>
                </div>

                <button
                  onClick={() => handleBuy(trade)}
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#16a34a",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TraderMarketplace;
