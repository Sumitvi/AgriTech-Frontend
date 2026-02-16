import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import {
  getFarmerProfile,
  updateFarmerProfile
} from "../../api/farmerApi";

const FarmerProfile = () => {
  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [form, setForm] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await getFarmerProfile(farmerId);
    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await updateFarmerProfile(farmerId, form);
    alert("Profile Updated");
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">
        Farmer Profile
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <input
          name="aadhaarNumber"
          value={form.aadhaarNumber || ""}
          onChange={handleChange}
          placeholder="Aadhaar"
          className="border p-2"
        />

        <input
          name="bankAccount"
          value={form.bankAccount || ""}
          onChange={handleChange}
          placeholder="Bank Account"
          className="border p-2"
        />

        <input
          name="ifscCode"
          value={form.ifscCode || ""}
          onChange={handleChange}
          placeholder="IFSC"
          className="border p-2"
        />

        <input
          name="village"
          value={form.village || ""}
          onChange={handleChange}
          placeholder="Village"
          className="border p-2"
        />

        <input
          name="district"
          value={form.district || ""}
          onChange={handleChange}
          placeholder="District"
          className="border p-2"
        />

        <input
          name="state"
          value={form.state || ""}
          onChange={handleChange}
          placeholder="State"
          className="border p-2"
        />

      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 mt-4"
      >
        Save Profile
      </button>
    </DashboardLayout>
  );
};

export default FarmerProfile;
