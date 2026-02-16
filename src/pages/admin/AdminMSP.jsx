import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  addMSP,
  getAllMSP,
  updateMSP,
  deleteMSP
} from "../../api/adminApi";

const AdminMSP = () => {

  const [cropName, setCropName] = useState("");
  const [price, setPrice] = useState("");
  const [mspList, setMspList] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchMSP();
  }, []);

  const fetchMSP = async () => {
    const res = await getAllMSP();
    setMspList(res.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cropName || !price) return;

    if (editId) {
      await updateMSP(editId, {
        cropName,
        mspPrice: price
      });
      setEditId(null);
    } else {
      await addMSP({
        cropName,
        mspPrice: price
      });
    }

    setCropName("");
    setPrice("");
    fetchMSP();
  };

  const handleEdit = (msp) => {
    setCropName(msp.cropName);
    setPrice(msp.mspPrice);
    setEditId(msp.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this MSP?")) {
      await deleteMSP(id);
      fetchMSP();
    }
  };

  const filteredMSP = mspList.filter(m =>
    m.cropName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* Add / Edit Form */}
        <div className="bg-white p-6 shadow rounded mb-8 max-w-md">
          <h2 className="text-xl font-bold mb-4">
            {editId ? "Edit MSP" : "Add MSP"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="Crop Name"
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="MSP Price"
              className="w-full border p-2 rounded"
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editId ? "Update MSP" : "Add MSP"}
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by crop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-64"
          />
        </div>

        {/* MSP List */}
        <div className="grid gap-4">
          {filteredMSP.map(msp => (
            <div
              key={msp.id}
              className="bg-white shadow p-4 rounded flex justify-between items-center"
            >
              <div>
                <p><b>Crop:</b> {msp.cropName}</p>
                <p><b>MSP:</b> ₹ {msp.mspPrice}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(msp)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(msp.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminMSP;
