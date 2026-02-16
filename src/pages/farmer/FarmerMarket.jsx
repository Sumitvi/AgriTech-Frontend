import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMarketPrices, getMSP } from "../../api/farmerApi";

const FarmerMarket = () => {

  const [cropName, setCropName] = useState("");
  const [state, setState] = useState("UP");

  const [marketData, setMarketData] = useState(null);
  const [mspData, setMspData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {

    if (!cropName) {
      alert("Enter crop name");
      return;
    }

    try {
      setLoading(true);

      const marketRes = await getMarketPrices({
        cropName,
        state
      });

      const mspRes = await getMSP(cropName);

      setMarketData(marketRes.data);
      setMspData(mspRes.data);

    } catch (error) {
      console.error(error);
      alert("No data found");
    } finally {
      setLoading(false);
    }
  };

  const getPriceIndicator = () => {
    if (!marketData || !mspData) return null;

    if (marketData.modalPrice > mspData.mspPrice) {
      return "text-green-600";
    } else {
      return "text-red-600";
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Market & MSP Prices
      </h1>

      {/* Search Section */}
      <div className="bg-white p-6 rounded shadow mb-6">

        <div className="grid grid-cols-3 gap-4">

          <input
            placeholder="Enter Crop (e.g. Wheat)"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="UP">UP</option>
            <option value="MP">MP</option>
            <option value="Punjab">Punjab</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-green-600 text-white rounded px-4"
          >
            Search
          </button>

        </div>

      </div>

      {/* Loading */}
      {loading && <p>Loading prices...</p>}

      {/* Market Result */}
      {marketData && mspData && (
        <div className="grid grid-cols-2 gap-6">

          {/* Market Card */}
          <div className="bg-white p-6 rounded shadow">

            <h3 className="text-lg font-bold mb-3">
              Mandi Price
            </h3>

            <p>Crop: {marketData.cropName}</p>
            <p>State: {marketData.state}</p>
            <p>
              Modal Price:
              <span className="ml-2 font-bold">
                ₹{marketData.modalPrice}
              </span>
            </p>

          </div>

          {/* MSP Card */}
          <div className="bg-white p-6 rounded shadow">

            <h3 className="text-lg font-bold mb-3">
              MSP Price
            </h3>

            <p>Crop: {cropName}</p>
            <p>
              MSP:
              <span className="ml-2 font-bold">
                ₹{mspData.mspPrice}
              </span>
            </p>

          </div>

        </div>
      )}

      {/* Comparison Section */}
      {marketData && mspData && (
        <div className="mt-6 bg-white p-6 rounded shadow">

          <h3 className="font-bold mb-3">
            Price Comparison
          </h3>

          <p className={`text-lg font-bold ${getPriceIndicator()}`}>
            {marketData.modalPrice > mspData.mspPrice
              ? "Market price is higher than MSP. Good time to sell!"
              : "MSP is higher. Consider government procurement."
            }
          </p>

        </div>
      )}

    </DashboardLayout>
  );
};

export default FarmerMarket;
