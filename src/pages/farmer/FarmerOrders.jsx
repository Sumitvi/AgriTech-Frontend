import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getMyOrders } from "../../api/farmerApi";

const FarmerOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (error) {
      console.error("Orders fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-yellow-500";
      case "SHIPPED":
        return "bg-blue-500";
      case "DELIVERED":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case "PLACED":
        return "33%";
      case "SHIPPED":
        return "66%";
      case "DELIVERED":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">
        My Orders
      </h2>

      {loading && <p>Loading orders...</p>}

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders found.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white shadow rounded-lg p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">
                    Order #{order.orderId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>

                <span
                  className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded text-sm`}
                >
                  {order.status}
                </span>
              </div>

              {/* Timeline */}
              <div className="relative mb-6">
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-green-600 h-2 rounded transition-all duration-500"
                    style={{ width: getProgressWidth(order.status) }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs mt-2 text-gray-500">
                  <span>Placed</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm border-b pb-2"
                  >
                    <span>{item.productName}</span>
                    <span>
                      {item.quantity} × ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default FarmerOrders;
