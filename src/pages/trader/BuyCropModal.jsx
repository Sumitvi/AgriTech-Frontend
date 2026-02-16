import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { buyCrop } from "../../api/traderApi";

const BuyCropModal = ({ trade, onClose, onSuccess }) => {

  const { user } = useContext(AuthContext);
  const traderId = user?.userId;

  const [rate, setRate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {

    if (!rate) {
      alert("Enter offered rate");
      return;
    }

    const payload = {
      tradeId: trade.id,
      traderId: traderId,
      offeredRate: Number(rate)
    };

    try {
      setLoading(true);
      await buyCrop(payload);

      alert("Trade accepted successfully!");
      onSuccess();
      onClose();

    } catch (error) {
      console.error("Buy error:", error);
      alert("Unable to buy crop");
    } finally {
      setLoading(false);
    }
  };

  if (!trade) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded w-96">

        <h3 className="text-xl font-bold mb-4">
          Buy {trade.cropName}
        </h3>

        <p>Quantity: {trade.qty} Quintal</p>
        <p>Farmer Expected Rate: ₹ {trade.rate}</p>

        <input
          type="number"
          placeholder="Your Offered Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="border p-2 w-full mt-3 mb-4 rounded"
        />

        <div className="flex justify-between">

          <button
            onClick={handleBuy}
            className="bg-green-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Buy"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-400 px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
};

export default BuyCropModal;
