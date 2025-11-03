    import React from 'react';
    import { Navigate, Outlet } from 'react-router-dom';

    const PrivateRoute = ({ children }) => {
        const isLoggedIn = localStorage.getItem("accessToken");
         const userRole = localStorage.getItem("role");
        const isAuthenticated = isLoggedIn !== undefined && userRole === "admin";
        return isAuthenticated ? children ? children : <Outlet /> : <Navigate to="/adminLogin" replace />;
    };

    export default PrivateRoute;