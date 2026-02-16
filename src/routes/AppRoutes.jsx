import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import FarmerCrops from "../pages/farmer/FarmerCrops";
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import TraderDashboard from "../pages/trader/TraderDashboard";
import ContractorDashboard from "../pages/contractor/ContractorDashboard";
import StoreDashboard from "../pages/store/StoreDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import RoleProtectedRoute from "../components/RoleProtectedRoute";
import FarmerMarket from "../pages/farmer/FarmerMarket";
import FarmerLands from "../pages/farmer/FarmerLands";
import FarmerTrades from "../pages/farmer/FarmerTrades";
import FarmerStore from "../pages/farmer/FarmerStore";
import FarmerCart from "../pages/farmer/FarmerCart";
import FarmerOrders from "../pages/farmer/FarmerOrders";
import FarmerProfile from "../pages/farmer/FarmerProfile";
import FarmerContractors from "../pages/farmer/FarmerContractors";
import FarmerSchemes from "../pages/farmer/FarmerSchemes";
import FarmerPayments from "../pages/farmer/FarmerPayments";
import ManageProducts from "../pages/store/ManageProducts";
import StoreOrders from "../pages/store/StoreOrders";






const AppRoutes = () => {
    return (
        <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/farmer/schemes" element={<FarmerSchemes />} />
            <Route path="/farmer/payments" element={<FarmerPayments />} />


            {/* <Route path="/store-owner" element={<StoreDashboard />} />
            <Route path="/store-owner/products" element={<ManageProducts />} />
            <Route path="/store-owner/orders" element={<StoreOrders />} /> */}

            <Route
                path="/farmer"
                element={
                    <RoleProtectedRoute allowedRoles={["FARMER"]}>
                        <FarmerDashboard />
                    </RoleProtectedRoute>
                }
            />

            <Route path="/farmer/cart" element={<FarmerCart />} />

            <Route path="/farmer/profile" element={<FarmerProfile />} />
            <Route path="/farmer/contractors" element={<FarmerContractors />} />



            <Route
                path="/trader"
                element={
                    <RoleProtectedRoute allowedRoles={["TRADER"]}>
                        <TraderDashboard />
                    </RoleProtectedRoute>
                }
            />

            <Route path="/farmer/store" element={<FarmerStore />} />


            <Route
                path="/farmer/lands"
                element={
                    <RoleProtectedRoute allowedRoles={["FARMER"]}>
                        <FarmerLands />
                    </RoleProtectedRoute>
                }
            />


            <Route
                path="/farmer/crops"
                element={
                    <RoleProtectedRoute allowedRoles={["FARMER"]}>
                        <FarmerCrops />
                    </RoleProtectedRoute>
                }
            />

            <Route path="/farmer/trades" element={<FarmerTrades />} />


            <Route
                path="/farmer/market"
                element={
                    <RoleProtectedRoute allowedRoles={["FARMER"]}>
                        <FarmerMarket />
                    </RoleProtectedRoute>
                }
            />

            <Route path="/farmer/orders" element={<FarmerOrders />} />


            <Route
                path="/contractor"
                element={
                    <RoleProtectedRoute allowedRoles={["CONTRACTOR"]}>
                        <ContractorDashboard />
                    </RoleProtectedRoute>
                }
            />

            {/* <Route
                path="/store"
                element={
                    <RoleProtectedRoute allowedRoles={["STORE_OWNER"]}>
                        <StoreDashboard />
                    </RoleProtectedRoute>
                }
            /> */}

            <Route
                path="/store"
                element={
                    <RoleProtectedRoute allowedRoles={["STORE_OWNER"]}>
                        <StoreDashboard />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/store/products"
                element={
                    <RoleProtectedRoute allowedRoles={["STORE_OWNER"]}>
                        <ManageProducts />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/store/orders"
                element={
                    <RoleProtectedRoute allowedRoles={["STORE_OWNER"]}>
                        <StoreOrders />
                    </RoleProtectedRoute>
                }
            />


            <Route
                path="/admin"
                element={
                    <RoleProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminDashboard />
                    </RoleProtectedRoute>
                }
            />

        </Routes>
    );
};

export default AppRoutes;
