export const menuConfig = {
  FARMER: [
    { name: "Dashboard", path: "/farmer" },
    { name: "My Lands", path: "/farmer/lands" },
    { name: "My Crops", path: "/farmer/crops" },
    { name: "Market Prices", path: "/farmer/market" },
    { name: "Store", path: "/farmer/store" }
  ],

  TRADER: [
    { name: "Dashboard", path: "/trader" },
    { name: "Buy Crops", path: "/trader/buy" },
    { name: "Trades", path: "/trader/trades" }
  ],

  CONTRACTOR: [
    { name: "Dashboard", path: "/contractor" },
    { name: "Available Jobs", path: "/contractor/jobs" }
  ],

  STORE_OWNER: [
    { name: "Dashboard", path: "/store" },
    { name: "Products", path: "/store/products" },
    { name: "Orders", path: "/store/orders" }
  ],

  ADMIN: [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Trades", path: "/admin/trades" },
    { name: "Payments", path: "/admin/payments" }
  ]
};
