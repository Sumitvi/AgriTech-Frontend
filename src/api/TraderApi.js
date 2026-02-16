import axiosInstance from "./axiosInstance";

/* ================= TRADES ================= */

export const buyCrop = (data) =>
  axiosInstance.post(`/trades/buy`, data);

export const getTraderTrades = (traderId) =>
  axiosInstance.get(`/trades/trader/${traderId}`);


/* ================= PAYMENTS ================= */

export const initiatePayment = (data) =>
  axiosInstance.post(`/payments/initiate`, data);

export const getTraderPayments = (traderId) =>
  axiosInstance.get(`/payments/trader/${traderId}`);


/* ================= MSP ================= */

export const getMSP = (data) =>
  axiosInstance.post(`/msp/get`, data);


/* ================= MARKET ================= */

export const getMandiPrices = (data) =>
  axiosInstance.post(`/market/mandi`, data);