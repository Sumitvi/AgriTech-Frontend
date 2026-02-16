const CropTimeline = () => {
  return (
    <div className="bg-white p-5 rounded shadow">
      <h3 className="font-bold mb-3">Crop Lifecycle</h3>

      <div className="flex justify-between text-sm">

        <div>Sowing</div>
        <div>Growing</div>
        <div>Harvest</div>

      </div>

      <div className="w-full bg-gray-300 h-2 mt-2 rounded">
        <div className="bg-green-600 h-2 w-2/3 rounded"></div>
      </div>
    </div>
  );
};

export default CropTimeline;
