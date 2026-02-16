import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { searchContractors } from "../../api/farmerApi";

const FarmerContractors = () => {

  const [district, setDistrict] = useState("");
  const [workType, setWorkType] = useState("");
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {

    if (!district || !workType) {
      alert("Select district and work type");
      return;
    }

    try {
      setLoading(true);
      const res = await searchContractors(district, workType);
      setContractors(res.data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Find Contractors
      </h1>

      {/* Search Section */}
      <div className="bg-white p-6 shadow rounded mb-6 flex gap-4">

        <input
          type="text"
          placeholder="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="border p-2 rounded w-1/3"
        />

        <select
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
          className="border p-2 rounded w-1/3"
        >
          <option value="">Select Work Type</option>
          <option value="HARVESTING">HARVESTING</option>
          <option value="PLOUGHING">PLOUGHING</option>
          <option value="SPRAYING">SPRAYING</option>
          <option value="TRANSPORT">TRANSPORT</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Search
        </button>

      </div>

      {loading && <p>Searching contractors...</p>}

      {/* Results */}
      {contractors.length === 0 && !loading && (
        <p className="text-gray-500">
          No contractors found.
        </p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {contractors.map((contractor) => (
          <div
            key={contractor.id}
            className="bg-white shadow rounded p-5"
          >
            <h3 className="font-bold text-lg">
              {contractor.name}
            </h3>

            <p className="text-sm text-gray-500">
              {contractor.workType}
            </p>

            <p className="text-sm mt-2">
              District: {contractor.district}
            </p>

            <p className="text-sm">
              State: {contractor.state}
            </p>

            <p className="mt-2 font-semibold">
              📞 {contractor.mobile}
            </p>

            <span
              className={`inline-block mt-3 px-3 py-1 text-sm rounded ${
                contractor.available
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {contractor.available ? "Available" : "Not Available"}
            </span>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
};

export default FarmerContractors;
