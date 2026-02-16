import { useState } from "react";

const AddCropModal = ({ lands = [], onAdd }) => {

  const [form, setForm] = useState({
    landId: "",
    cropName: "",
    sowingDate: "",
    expectedHarvestDate: "",
    expectedYieldQuintal: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.landId) {
      alert("Please select a land");
      return;
    }

    onAdd(form);

    // Reset form after adding
    setForm({
      landId: "",
      cropName: "",
      sowingDate: "",
      expectedHarvestDate: "",
      expectedYieldQuintal: ""
    });
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg">
      <h3 className="font-bold mb-4 text-lg">Add Crop</h3>

      {/* Select Land */}
      <select
        name="landId"
        value={form.landId}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      >
        <option value="">Select Land</option>

        {lands.length === 0 && (
          <option disabled>No Lands Available</option>
        )}

        {lands.map((land) => (
          <option key={land.id} value={land.id}>
            Land #{land.id} - {land.areaInAcre} Acre - {land.soilType} Soil
          </option>
        ))}
      </select>

      {/* Crop Name */}
      <input
        name="cropName"
        value={form.cropName}
        placeholder="Crop Name (e.g. Wheat)"
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />

      {/* Sowing Date */}
      <input
        name="sowingDate"
        type="date"
        value={form.sowingDate}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />

      {/* Expected Harvest Date */}
      <input
        name="expectedHarvestDate"
        type="date"
        value={form.expectedHarvestDate}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />

      {/* Expected Yield */}
      <input
        name="expectedYieldQuintal"
        placeholder="Expected Yield (Quintal)"
        value={form.expectedYieldQuintal}
        onChange={handleChange}
        className="border p-2 w-full mb-4 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full rounded"
      >
        Add Crop
      </button>
    </div>
  );
};

export default AddCropModal;
