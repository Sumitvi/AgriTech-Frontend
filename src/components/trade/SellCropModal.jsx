import { useEffect, useState } from "react";
import { getMarketPrices, getMSP } from "../../api/farmerApi";

const SellCropModal = ({ crop, onSubmit, onClose }) => {

  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (crop) fetchSuggestedRate();
  }, [crop]);

  const fetchSuggestedRate = async () => {
    try {
      setLoading(true);

      // 🔥 Correct endpoint: /market/mandi
      const marketRes = await getMarketPrices({
        cropName: crop.cropName,
        state: "UP"
      });

      const mspRes = await getMSP(crop.cropName);

      let marketPrice = 0;

      // Backend returns LIST
      if (marketRes?.data?.length > 0) {
        marketPrice = marketRes.data[0].modalPrice;
      }

      const mspPrice = mspRes?.data?.mspPrice || 0;

      const suggested = Math.max(marketPrice, mspPrice);

      setRate(suggested);

      if (marketPrice > mspPrice) {
        setSuggestion("Market price is better. Suggested market rate applied.");
      } else if (mspPrice > 0) {
        setSuggestion("MSP is higher. Suggested MSP rate applied.");
      } else {
        setSuggestion("No price data found. Please enter rate manually.");
      }

    } catch (error) {
      console.error("Price fetch error:", error);
      setSuggestion("Unable to fetch price data.");
    } finally {
      setLoading(false);
    }
  };

  if (!crop) return null;

  const handleSubmit = () => {

    if (!quantity || !rate) {
      alert("Enter quantity and rate");
      return;
    }

    if (Number(quantity) > crop.actualYieldQuintal) {
      alert("Quantity exceeds harvested yield");
      return;
    }

    onSubmit({
      cropId: crop.id,
      quantityQuintal: Number(quantity),
      expectedRate: Number(rate)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

        <h3 className="text-xl font-bold mb-4">
          Sell {crop.cropName}
        </h3>

        <p className="text-sm text-gray-500 mb-2">
          Available Yield: {crop.actualYieldQuintal} Quintal
        </p>

        {loading && (
          <p className="text-blue-500 text-sm mb-2">
            Fetching best price...
          </p>
        )}

        {suggestion && (
          <p className="text-green-600 text-sm mb-3">
            {suggestion}
          </p>
        )}

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          placeholder="Expected Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <div className="flex justify-between">

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            List for Trade
          </button>

          <button
            onClick={onClose}
            className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
};

export default SellCropModal;
