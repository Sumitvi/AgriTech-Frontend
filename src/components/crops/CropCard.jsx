const CropCard = ({ crop, onHarvest, onSell }) => {

  const isHarvested = crop.status === "HARVESTED";

  return (
    <div className="bg-white shadow rounded-lg p-5 border">

      <h3 className="text-lg font-bold">{crop.cropName}</h3>

      <p className="text-sm text-gray-500">
        Expected Yield: {crop.expectedYieldQuintal || "-"} Quintal
      </p>

      {crop.actualYieldQuintal && (
        <p className="text-sm text-green-600">
          Harvested: {crop.actualYieldQuintal} Quintal
        </p>
      )}

      <p className="mt-2 text-sm">
        Status:
        <span className="ml-2 font-semibold">
          {crop.status}
        </span>
      </p>

      {/* Harvest Button */}
      {!isHarvested && (
        <button
          onClick={() => onHarvest(crop.id)}
          className="mt-4 bg-green-600 text-white px-3 py-1 rounded"
        >
          Harvest
        </button>
      )}

      {/* Sell Button */}
      {isHarvested && (
        <button
          onClick={() => onSell(crop)}
          className="mt-4 bg-blue-600 text-white px-3 py-1 rounded"
        >
          Sell Crop
        </button>
      )}

    </div>
  );
};

export default CropCard;
