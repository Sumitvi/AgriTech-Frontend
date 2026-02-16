import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";

const StoreDashboard = () => {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeOrders: 0,
    shippedOrders: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const productRes = await axiosInstance.get("/store/my-products");
      const orderRes = await axiosInstance.get("/orders/store");

      const productsData = productRes.data || [];
      const ordersData = orderRes.data || [];

      setProducts(productsData);
      setOrders(ordersData);

      calculateStats(productsData, ordersData);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  const calculateStats = (products, orders) => {

    const totalProducts = products.length;

    const activeOrders = orders.filter(
      o => o.status === "PLACED"
    ).length;

    const shippedOrders = orders.filter(
      o => o.status === "SHIPPED"
    ).length;

    const revenue = orders
      .filter(o => o.status === "DELIVERED")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    setStats({
      totalProducts,
      activeOrders,
      shippedOrders,
      revenue
    });
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Store Owner Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white shadow rounded p-5">
          <p className="text-gray-500 text-sm">Total Products</p>
          <h2 className="text-2xl font-bold">
            {stats.totalProducts}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-5">
          <p className="text-gray-500 text-sm">Active Orders</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {stats.activeOrders}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-5">
          <p className="text-gray-500 text-sm">Shipped Orders</p>
          <h2 className="text-2xl font-bold text-purple-600">
            {stats.shippedOrders}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-5">
          <p className="text-gray-500 text-sm">Revenue</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹ {stats.revenue}
          </h2>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default StoreDashboard;
