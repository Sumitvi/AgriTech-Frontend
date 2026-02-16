import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CropCard from "../../components/crops/CropCard";
import AddCropModal from "../../components/crops/AddCropModal";
import CropTimeline from "../../components/crops/CropTimeline";
import SellCropModal from "../../components/trade/SellCropModal";
import { AuthContext } from "../../context/AuthContext";

import {
  addCrop,
  getFarmerCrops,
  harvestCrop,
  getFarmerLands,
  sellCrop
} from "../../api/farmerApi";

const FarmerCrops = () => {

  const { user } = useContext(AuthContext);
  const farmerId = user?.userId;

  const [crops, setCrops] = useState([]);
  const [lands, setLands] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (farmerId) fetchData();
  }, [farmerId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const cropRes = await getFarmerCrops(farmerId);
      const landRes = await getFarmerLands(farmerId);

      setCrops(cropRes?.data || []);
      setLands(landRes?.data || []);

    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🌱 ADD CROP
  const handleAddCrop = async (form) => {

    if (!farmerId) {
      alert("Farmer not identified");
      return;
    }

    if (!form?.landId) {
      alert("Please select land");
      return;
    }

    try {
      await addCrop(
        farmerId,
        form.landId,
        form
      );

      fetchData();
    } catch (error) {
      console.error("Error adding crop:", error);
    }
  };

  // 🌾 HARVEST
  const handleHarvest = async (id) => {

    const actualYield = prompt("Enter Actual Yield");

    if (!actualYield) return;

    try {
      await harvestCrop(id, Number(actualYield));
      fetchData();
    } catch (error) {
      console.error("Harvest error:", error);
    }
  };

  const handleSell = (crop) => {
    setSelectedCrop(crop);
  };

  const handleSellSubmit = async (form) => {
    await sellCrop(form);
    setSelectedCrop(null);
    fetchData();
    alert("Crop successfully listed for trade!");
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Crop Lifecycle
      </h1>

      <CropTimeline />

      <div className="mt-6">
        <AddCropModal
          lands={lands}
          onAdd={handleAddCrop}
        />
      </div>

      {loading && (
        <p className="mt-6 text-gray-500">
          Loading crops...
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mt-6">
        {crops.map((crop) => (
          <CropCard
            key={crop.id}
            crop={crop}
            onHarvest={handleHarvest}
            onSell={handleSell}
          />
        ))}
      </div>

      {selectedCrop && (
        <SellCropModal
          crop={selectedCrop}
          onSubmit={handleSellSubmit}
          onClose={() => setSelectedCrop(null)}
        />
      )}

    </DashboardLayout>
  );
};

export default FarmerCrops;
