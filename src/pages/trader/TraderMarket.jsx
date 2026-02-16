import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMandiPrices, getMSP } from "../../api/traderApi";

const TraderMarket = () => {

  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [prices, setPrices] = useState([]);
  const [msp, setMsp] = useState(null);
  const [mspError, setMspError] = useState("");

  const handleSearch = async () => {
    try {
      setMsp(null);
      setMspError("");

      // Fetch mandi prices
      const mandiRes = await getMandiPrices({
        cropName: crop,
        state: state
      });

      setPrices(mandiRes.data || []);

      // Fetch MSP separately (so mandi still works if MSP fails)
      try {
        const mspRes = await getMSP({
          cropName: crop
        });
        setMsp(mspRes.data);
      } catch (err) {
        console.log("MSP not found");
        setMsp(null);
        setMspError("MSP not found for this crop.");
      }

    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Market & MSP
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          placeholder="Crop"
          onChange={(e) => setCrop(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="State"
          onChange={(e) => setState(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4"
        >
          Search
        </button>
      </div>

      {/* MSP Section */}
      {msp && (
        <p className="text-lg font-semibold">
          MSP: ₹ {msp.mspPrice}
        </p>
      )}

      {mspError && (
        <p className="text-red-600 font-medium">
          {mspError}
        </p>
      )}

      {/* Mandi Prices */}
      {prices.map((p, i) => (
        <div key={i} className="bg-white p-4 shadow rounded mt-3">
          <p><b>Mandi:</b> {p.mandiName}</p>
          <p><b>Modal Price:</b> ₹ {p.modalPrice}</p>
        </div>
      ))}

    </DashboardLayout>
  );
};

export default TraderMarket;
