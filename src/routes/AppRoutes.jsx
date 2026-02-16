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



const AppRoutes = () => {
    return (
        <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/farmer"
                element={
                    <RoleProtectedRoute allowedRoles={["FARMER"]}>
                        <FarmerDashboard />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/trader"
                element={
                    <RoleProtectedRoute allowedRoles={["TRADER"]}>
                        <TraderDashboard />
                    </RoleProtectedRoute>
                }
            />

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

            <Route
                path="/farmer/market"
                element={
                    <RoleProtectedRoute allowedRoles={["FARMER"]}>
                        <FarmerMarket />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/contractor"
                element={
                    <RoleProtectedRoute allowedRoles={["CONTRACTOR"]}>
                        <ContractorDashboard />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/store"
                element={
                    <RoleProtectedRoute allowedRoles={["STORE_OWNER"]}>
                        <StoreDashboard />
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
