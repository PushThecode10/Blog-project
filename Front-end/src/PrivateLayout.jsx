import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  const isAuthenticated = accessToken && userRole === "admin";

  // Render children if passed, else Outlet for nested routes
  return isAuthenticated ? (children ? children : <Outlet />) : <Navigate to="/adminLogin" replace />;
};

export default PrivateRoute;
