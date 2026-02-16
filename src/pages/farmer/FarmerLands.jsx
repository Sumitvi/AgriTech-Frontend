import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import {
  addLand,
  getFarmerLands,
  updateLand,
  deleteLand
} from "../../api/farmerApi";

const FarmerLands = () => {

  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [lands, setLands] = useState([]);
  const [form, setForm] = useState({
    areaInAcre: "",
    soilType: "",
    irrigationType: "",
    village: "",
    district: "",
    state: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (farmerId) fetchLands();
  }, [farmerId]);

  const fetchLands = async () => {
    const res = await getFarmerLands(farmerId);
    setLands(res.data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    if (!form.areaInAcre || !form.soilType) {
      alert("Area and Soil required");
      return;
    }

    if (editingId) {
      await updateLand(farmerId, editingId, form);
      setEditingId(null);
    } else {
      await addLand(farmerId, form);
    }

    setForm({
      areaInAcre: "",
      soilType: "",
      irrigationType: "",
      village: "",
      district: "",
      state: ""
    });

    fetchLands();
  };

  const handleEdit = (land) => {
    setForm(land);
    setEditingId(land.id);
  };

  const handleDelete = async (landId) => {

    if (!window.confirm("Are you sure you want to delete this land?")) return;

    await deleteLand(farmerId, landId);
    fetchLands();
  };

  return (
    <DashboardLayout>

      <h2 className="text-xl font-bold mb-6">
        My Lands
      </h2>

      {/* Add / Edit Form */}
      <div className="bg-white p-6 rounded shadow mb-6 grid grid-cols-2 gap-4">

        <input name="areaInAcre" placeholder="Area"
          value={form.areaInAcre} onChange={handleChange}
          className="border p-2 rounded" />

        <input name="soilType" placeholder="Soil Type"
          value={form.soilType} onChange={handleChange}
          className="border p-2 rounded" />

        <input name="irrigationType" placeholder="Irrigation"
          value={form.irrigationType} onChange={handleChange}
          className="border p-2 rounded" />

        <input name="village" placeholder="Village"
          value={form.village} onChange={handleChange}
          className="border p-2 rounded" />

        <input name="district" placeholder="District"
          value={form.district} onChange={handleChange}
          className="border p-2 rounded" />

        <input name="state" placeholder="State"
          value={form.state} onChange={handleChange}
          className="border p-2 rounded" />

        <button
          onClick={handleSubmit}
          className={`col-span-2 px-4 py-2 rounded text-white ${
            editingId ? "bg-yellow-600" : "bg-green-600"
          }`}
        >
          {editingId ? "Update Land" : "Add Land"}
        </button>

      </div>

      {/* Land Cards */}
      {lands.map((land) => (
        <div key={land.id}
          className="bg-white p-4 rounded shadow mb-4 flex justify-between items-center">

          <div>
            <p><strong>Area:</strong> {land.areaInAcre} Acre</p>
            <p><strong>Soil:</strong> {land.soilType}</p>
            <p><strong>Irrigation:</strong> {land.irrigationType}</p>
            <p><strong>Village:</strong> {land.village}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(land)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(land.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>

        </div>
      ))}

    </DashboardLayout>
  );
};

export default FarmerLands;
