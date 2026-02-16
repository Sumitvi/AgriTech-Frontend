import axiosInstance from "./axiosInstance";

/* ================= PRODUCTS ================= */

export const addProduct = (data) =>
  axiosInstance.post(`/store/product`, data);

export const deactivateProduct = (productId) =>
  axiosInstance.post(`/store/deactivate/${productId}`);


/* ================= ORDERS ================= */

export const shipOrder = (orderId) =>
  axiosInstance.post(`/orders/${orderId}/ship`);

export const deliverOrder = (orderId) =>
  axiosInstance.post(`/orders/${orderId}/deliver`);


export const getMyProducts = () =>
  axiosInstance.get("/store/my-products");
