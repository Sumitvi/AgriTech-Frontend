import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔹 Helper: Get default route based on role
  const getDefaultRoute = (role) => {
    switch (role) {
      case "ROLE_FARMER":
        return "/farmer";
      case "ROLE_TRADER":
        return "/trader";
      case "ROLE_CONTRACTOR":
        return "/contractor";
      case "ROLE_STORE_OWNER":
        return "/store";
      case "ROLE_ADMIN":
        return "/admin";
      default:
        return "/login";
    }
  };

  // 🔹 Auto Login if token exists
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        logout();
      }
    }
  }, [token]);

  // 🔹 Login
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const decoded = jwtDecode(newToken);
    setUser(decoded);
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        getDefaultRoute
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
