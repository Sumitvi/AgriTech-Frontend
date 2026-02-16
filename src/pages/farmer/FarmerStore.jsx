import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStoreProducts, addToCart } from "../../api/farmerApi";

const FarmerStore = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getStoreProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Store fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart({
        productId: productId,
        quantity: 1
      });

      alert("Product added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  return (
    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">
        Agri Store
      </h2>

      {loading && <p>Loading products...</p>}

      {products.length === 0 && !loading && (
        <p className="text-gray-500">
          No products available.
        </p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 shadow rounded"
          >
            <h3 className="font-bold text-lg mb-2">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 mb-2">
              Category: {product.category}
            </p>

            <p className="text-green-600 font-semibold mb-2">
              ₹{product.price}
            </p>

            <p className="text-sm mb-4">
              Stock: {product.stockQuantity}
            </p>

            <button
              onClick={() => handleAddToCart(product.id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
};

export default FarmerStore;
