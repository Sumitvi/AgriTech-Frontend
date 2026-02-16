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

      const marketRes = await getMarketPrices({
        cropName: crop.cropName,
        state: "UP" // later can auto detect from profile
      });

      const mspRes = await getMSP(crop.cropName);

      const marketPrice = marketRes.data.modalPrice;
      const mspPrice = mspRes.data.mspPrice;

      const suggested = marketPrice > mspPrice
        ? marketPrice
        : mspPrice;

      setRate(suggested);

      setSuggestion(
        marketPrice > mspPrice
          ? "Market price is better. Suggested rate applied."
          : "MSP is higher. Suggested MSP rate applied."
      );

    } catch (error) {
      console.error("Price fetch error:", error);
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

      <div className="bg-white p-6 rounded-lg w-96">

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
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            List for Trade
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

export default SellCropModal;
