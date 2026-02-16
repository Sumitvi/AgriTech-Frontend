import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  addMandiPrice,
  getAllMandi,
  updateMandiPrice,
  deleteMandiPrice,
} from "../../api/adminApi";

const AdminMandi = () => {
  const [form, setForm] = useState({
    cropName: "",
    state: "",
    mandiName: "",
    modalPrice: "",
  });

  const [mandiList, setMandiList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMandi();
  }, []);

  const fetchMandi = async () => {
    const res = await getAllMandi();
    setMandiList(res.data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateMandiPrice(editingId, form);
      alert("Updated Successfully ✅");
    } else {
      await addMandiPrice(form);
      alert("Added Successfully ✅");
    }

    setForm({
      cropName: "",
      state: "",
      mandiName: "",
      modalPrice: "",
    });
    setEditingId(null);
    fetchMandi();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this mandi price?")) {
      await deleteMandiPrice(id);
      fetchMandi();
    }
  };

  const filtered = mandiList.filter(
    (m) =>
      m.cropName.toLowerCase().includes(search.toLowerCase()) ||
      m.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Manage Mandi Prices
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
          <input name="cropName" value={form.cropName} onChange={handleChange} placeholder="Crop Name" className="border p-2 rounded" />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-2 rounded" />
          <input name="mandiName" value={form.mandiName} onChange={handleChange} placeholder="Mandi Name" className="border p-2 rounded" />
          <input name="modalPrice" value={form.modalPrice} onChange={handleChange} placeholder="Modal Price" className="border p-2 rounded" />

          <button className="col-span-2 bg-green-600 text-white py-2 rounded">
            {editingId ? "Update" : "Add"}
          </button>
        </form>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by crop or state..."
          className="border p-2 rounded mb-4 w-full"
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white shadow rounded">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Crop</th>
                <th className="p-3">State</th>
                <th className="p-3">Mandi</th>
                <th className="p-3">Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-3">{m.cropName}</td>
                  <td className="p-3">{m.state}</td>
                  <td className="p-3">{m.mandiName}</td>
                  <td className="p-3">₹ {m.modalPrice}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              No mandi records found.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminMandi;
