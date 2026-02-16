import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  getCart,
  updateCart,
  removeCartItem,
  placeOrder
} from "../../api/farmerApi";

const FarmerCart = () => {

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCart({
        productId,
        quantity: Number(quantity)
      });
      fetchCart();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem({ productId });
      fetchCart();
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await placeOrder();
      alert("Order placed successfully!");
      fetchCart();
    } catch (error) {
      console.error("Order error:", error);
    }
  };

  return (
    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">
        My Cart
      </h2>

      {loading && <p>Loading cart...</p>}

      {!cart || cart.items?.length === 0 ? (
        <p className="text-gray-500">
          Cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="bg-white p-4 shadow rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} per unit
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleUpdateQuantity(
                        item.productId,
                        e.target.value
                      )
                    }
                    className="border p-1 w-20 rounded"
                  />

                  <button
                    onClick={() =>
                      handleRemove(item.productId)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white p-4 shadow rounded flex justify-between items-center">
            <h3 className="text-lg font-bold">
              Total: ₹{cart.totalAmount}
            </h3>

            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        </>
      )}

    </DashboardLayout>
  );
};

export default FarmerCart;
