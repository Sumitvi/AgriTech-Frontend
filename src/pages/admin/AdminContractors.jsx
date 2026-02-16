import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  addContractor,
  verifyContractor,
  blockContractor,
  getAllContractors,
  searchContractors,
  updateContractor,
  deleteContractor
} from "../../api/adminApi";

const AdminContractors = () => {
  const [contractors, setContractors] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    district: "",
    state: "",
    workType: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    const res = await getAllContractors();
    setContractors(res.data || []);
  };

  const handleSearch = async () => {
    if (!search) return fetchContractors();
    const res = await searchContractors(search);
    setContractors(res.data || []);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!form.name || !form.mobile) {
      return alert("Fill required fields");
    }

    if (editingId) {
      await updateContractor(editingId, form);
      alert("Updated Successfully");
      setEditingId(null);
    } else {
      await addContractor(form);
      alert("Added Successfully");
    }

    setForm({
      name: "",
      mobile: "",
      district: "",
      state: "",
      workType: ""
    });

    fetchContractors();
  };

  const handleEdit = (contractor) => {
    setEditingId(contractor.id);
    setForm(contractor);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contractor?")) return;
    await deleteContractor(id);
    fetchContractors();
  };

  const handleVerify = async (id) => {
    await verifyContractor(id);
    fetchContractors();
  };

  const handleBlock = async (id) => {
    await blockContractor(id);
    fetchContractors();
  };

  return (
    <DashboardLayout>
      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">
          Contractor Management
        </h1>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contractor..."
            className="border px-4 py-2 rounded w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {/* Add / Update Form */}
        <div className="bg-white p-6 rounded shadow mb-8 max-w-xl">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Contractor" : "Add Contractor"}
          </h2>

          <form onSubmit={handleAddOrUpdate} className="space-y-3">
            {["name", "mobile", "district", "state", "workType"].map((field) => (
              <input
                key={field}
                value={form[field] || ""}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                placeholder={field}
                className="w-full border px-4 py-2 rounded"
              />
            ))}

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </form>
        </div>

        {/* Contractors Table */}
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">District</th>
                <th className="p-3">State</th>
                <th className="p-3">Work</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {contractors.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.mobile}</td>
                  <td className="p-3">{c.district}</td>
                  <td className="p-3">{c.state}</td>
                  <td className="p-3">{c.workType}</td>
                  <td className="p-3">
                    {c.verified ? "✅" : "❌"}
                  </td>
                  <td className="p-3">
                    {c.active ? "Active" : "Blocked"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleVerify(c.id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Verify
                    </button>

                    <button
                      onClick={() => handleBlock(c.id)}
                      className="bg-gray-700 text-white px-2 py-1 rounded"
                    >
                      Block
                    </button>
                  </td>
                </tr>
              ))}

              {contractors.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-500">
                    No contractors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminContractors;
