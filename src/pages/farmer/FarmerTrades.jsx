import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getTradeHistory } from "../../api/farmerApi";

const FarmerTrades = () => {

    const { user } = useContext(AuthContext);
    const farmerId = user?.userId;

    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (farmerId) fetchTrades();
    }, [farmerId]);

    const fetchTrades = async () => {
        try {
            setLoading(true);
            const res = await getTradeHistory(farmerId);
            setTrades(res.data || []);
        } catch (error) {
            console.error("Trade fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>

            <h2 className="text-2xl font-bold mb-6">
                My Trade History
            </h2>

            {loading && <p>Loading trades...</p>}

            {trades.length === 0 && !loading && (
                <p className="text-gray-500">
                    No trades found.
                </p>
            )}

            <div className="space-y-4">
                {trades.map((trade) => (
                    <div key={trade.id} className="bg-white shadow p-4 rounded">
                        <p><strong>Crop:</strong> {trade.crop?.cropName}</p>
                        <p><strong>Quantity:</strong> {trade.quantityQuintal} Quintal</p>
                        <p><strong>Rate:</strong> ₹{trade.expectedRate}</p>
                        <p><strong>Status:</strong> {trade.status}</p>
                    </div>
                ))}
            </div>

        </DashboardLayout>
    );
};

export default FarmerTrades;
