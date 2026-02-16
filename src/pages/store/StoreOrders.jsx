import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { shipOrder, deliverOrder } from "../../api/StoreOwnerApi";
import axiosInstance from "../../api/axiosInstance";

const StoreOrders = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders/store");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleShip = async (id) => {
    try {
      await shipOrder(id);
      fetchOrders();
    } catch (error) {
      console.error("Ship error:", error);
    }
  };

  const handleDeliver = async (id) => {
    try {
      await deliverOrder(id);
      fetchOrders();
    } catch (error) {
      console.error("Deliver error:", error);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Store Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white p-5 shadow rounded">

              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">
                    Order ID: {order.orderId}
                  </p>
                  <p>Total: ₹ {order.totalAmount}</p>
                  <p>Status: 
                    <span className="ml-2 font-bold text-blue-600">
                      {order.status}
                    </span>
                  </p>
                </div>

                <div className="space-x-2">

                  {order.status === "PLACED" && (
                    <button
                      onClick={() => handleShip(order.orderId)}
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Ship
                    </button>
                  )}

                  {order.status === "SHIPPED" && (
                    <button
                      onClick={() => handleDeliver(order.orderId)}
                      className="bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Deliver
                    </button>
                  )}

                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-semibold">Items:</h4>
                {order.items.map((item, index) => (
                  <p key={index}>
                    {item.productName} × {item.quantity}
                  </p>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default StoreOrders;
