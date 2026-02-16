import axiosInstance from "./axiosInstance";

/* ================= DASHBOARD ================= */

export const getAdminDashboard = () =>
  axiosInstance.get(`/admin/dashboard`);

export const getAdminAnalytics = () =>
  axiosInstance.get(`/analytics/admin`);


/* ================= USERS ================= */

export const getAllUsers = () =>
  axiosInstance.get(`/admin/users`);

export const verifyUser = (data) =>
  axiosInstance.post(`/admin/verify-user`, data);

export const blockUser = (data) =>
  axiosInstance.post(`/admin/block-user`, data);


/* ================= SCHEMES ================= */

export const verifyScheme = (schemeId, verified) =>
  axiosInstance.post(
    `/admin/verify-scheme?schemeId=${schemeId}&verified=${verified}`
  );


/* ================= TRADES ================= */

export const getAllTrades = () =>
  axiosInstance.get(`/admin/trades`);


/* ================= PAYMENTS ================= */

export const getAllPayments = () =>
  axiosInstance.get(`/admin/payments`);


/* ================= MSP ================= */

export const addMSP = (data) =>
  axiosInstance.post(`/msp/add`, data);


/* ================= MARKET ================= */

export const addMandiPrice = (data) =>
  axiosInstance.post(`/market/mandi/add`, data);


/* ================= SCHEMES SYNC ================= */

export const syncScheme = (data) =>
  axiosInstance.post(`/schemes/sync`, data);


/* ================= CONTRACTORS ================= */

export const addContractor = (data) =>
  axiosInstance.post(`/contractors`, data);

export const verifyContractor = (id) =>
  axiosInstance.post(`/contractors/admin/verify/${id}`);

export const blockContractor = (id) =>
  axiosInstance.post(`/contractors/admin/block/${id}`);


export const getAllMSP = () =>
  axiosInstance.get(`/msp/all`);

export const updateMSP = (id, data) =>
  axiosInstance.put(`/msp/update/${id}`, data);

export const deleteMSP = (id) =>
  axiosInstance.delete(`/msp/delete/${id}`);


export const getAllMandi = () =>
  axiosInstance.get(`/market/mandi/all`);


export const updateMandiPrice = (id, data) =>
  axiosInstance.put(`/market/mandi/update/${id}`, data);

export const deleteMandiPrice = (id) =>
  axiosInstance.delete(`/market/mandi/delete/${id}`);





export const getAllContractors = () =>
  axiosInstance.get("/contractors/all");

export const searchContractors = (keyword) =>
  axiosInstance.get(`/contractors/search?keyword=${keyword}`);

export const updateContractor = (id, data) =>
  axiosInstance.put(`/contractors/update/${id}`, data);

export const deleteContractor = (id) =>
  axiosInstance.delete(`/contractors/delete/${id}`);

