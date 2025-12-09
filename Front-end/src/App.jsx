import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async"; 
import { publicRoutes, userRoutes, adminRoutes } from "./Routes";
import { useAuth } from "./Context/AuthProvide";

// Rest of your code stays the same
const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();

  const getTitle = () => {
    const route = [...publicRoutes, ...userRoutes, ...adminRoutes].find(
      (r) => r.path === location.pathname
    );
    return route?.title ? `${route.title} | My App` : "My App";
  };

  return (
    <>
  {/* this is Routes */}
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}

        {userRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <UserProtectedRoute>
                <route.component />
              </UserProtectedRoute>
            }
          />
        ))}

        {adminRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <route.Layout>
                <route.component />
              </route.Layout>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;