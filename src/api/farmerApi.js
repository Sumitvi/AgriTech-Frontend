import axiosInstance from "./axiosInstance";

export const getLands = (farmerId) => {
  return axiosInstance.get(`/farmers/${farmerId}/lands`);
};


/* PROFILE */

export const getFarmerProfile = (id) =>
  axiosInstance.get(`/farmers/profile/${id}`);

export const updateFarmerProfile = (id, data) =>
  axiosInstance.post(`/farmers/profile/${id}`, data);


/* LANDS */

export const addLand = (farmerId, data) =>
  axiosInstance.post(`/farmers/${farmerId}/lands`, data);

export const getFarmerLands = (farmerId) =>
  axiosInstance.get(`/farmers/${farmerId}/lands`);

export const updateLand = (farmerId, landId, data) =>
  axiosInstance.put(`/farmers/${farmerId}/lands/${landId}`, data);

export const deleteLand = (farmerId, landId) =>
  axiosInstance.delete(`/farmers/${farmerId}/lands/${landId}`);


/* CROPS */

export const addCrop = (farmerId, landId, data) =>
  axiosInstance.post(
    `/crops/sow?farmerId=${farmerId}&landId=${landId}`,
    data
  );


export const getFarmerCrops = (id) =>
  axiosInstance.get(`/crops/farmer/${id}`);


export const harvestCrop = (cropId, actualYieldQuintal) =>
  axiosInstance.put(
    `/crops/${cropId}/harvest?actualYieldQuintal=${actualYieldQuintal}`
  );



/* MARKET */

export const getMarketPrices = (data) =>
  axiosInstance.post("/market/prices", data);

export const getMSP = (cropName) =>
  axiosInstance.get(`/msp/${cropName}`);


/* TRADES */

export const sellCrop = (data) =>
  axiosInstance.post("/trades/sell", data);

export const getTradeHistory = (farmerId) =>
  axiosInstance.get(`/trades/farmer/${farmerId}`);


/* STORE */

export const getStoreProducts = () =>
  axiosInstance.get("/store/products");


/* CART */

export const addToCart = (data) =>
  axiosInstance.post("/cart/add", data);

export const getCart = () =>
  axiosInstance.get("/cart");

export const updateCart = (data) =>
  axiosInstance.put("/cart/update", data);

export const removeCartItem = (data) =>
  axiosInstance.delete("/cart/remove", { data });


/* ORDERS */

export const placeOrder = () =>
  axiosInstance.post("/orders/place", {});

export const getMyOrders = () =>
  axiosInstance.get("/orders/my");
