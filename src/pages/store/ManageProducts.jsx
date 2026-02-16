import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  addProduct,
  deactivateProduct
} from "../../api/StoreOwnerApi";
import { getMyProducts } from "../../api/StoreOwnerApi";

const ManageProducts = () => {

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stockQuantity: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getMyProducts();
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stockQuantity) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      await addProduct({
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity)
      });

      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        stockQuantity: ""
      });

      fetchProducts();
      alert("Product added successfully!");

    } catch (error) {
      console.error("Add product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateProduct(id);
      fetchProducts();
    } catch (error) {
      console.error("Deactivate error:", error);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Manage Products
      </h1>

      {/* Add Product Form */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Add New Product
        </h2>

        <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={form.stockQuantity}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded col-span-2"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

        </form>
      </div>

      {/* Product List */}
      <div className="bg-white shadow-md p-6 rounded-lg">

        <h2 className="text-lg font-semibold mb-4">
          My Products
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">
            No products added yet.
          </p>
        ) : (
          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border">

                  <td className="p-2 border">
                    {product.name}
                  </td>

                  <td className="p-2 border">
                    {product.category}
                  </td>

                  <td className="p-2 border">
                    ₹ {product.price}
                  </td>

                  <td className="p-2 border">
                    {product.stockQuantity}
                  </td>

                  <td className="p-2 border">
                    {product.active ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-2 border">
                    {product.active && (
                      <button
                        onClick={() => handleDeactivate(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </DashboardLayout>
  );
};

export default ManageProducts;
