import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getSchemesForFarmer } from "../../api/farmerApi";

const FarmerSchemes = () => {

  const [state, setState] = useState("");
  const [crop, setCrop] = useState("");
  const [schemes, setSchemes] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await getSchemesForFarmer({
        state,
        crop
      });

      setSchemes(res.data || []);
    } catch (error) {
      console.error("Scheme error:", error);
    }
  };

  return (
    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">
        Government Schemes
      </h2>

      <div className="flex gap-4 mb-6">
        <input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Crop"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <div key={scheme.id} className="bg-white shadow p-5 rounded">
            <h3 className="font-bold">{scheme.schemeName}</h3>
            <p className="text-sm mt-2">{scheme.description}</p>
            <p className="mt-2 text-green-600 font-semibold">
              {scheme.benefit}
            </p>
            <a
              href={scheme.applyLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm mt-3 block"
            >
              Apply Now
            </a>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
};

export default FarmerSchemes;
