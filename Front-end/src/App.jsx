// App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, userRoutes, adminRoutes } from "./Routes";
import { AuthProvider, useAuth } from "./Context/AuthProvide";

// Protected Route Component for Users
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
  const { fetchUser } = useAuth();
  
  useEffect(() => {
    fetchUser();
  }, []);
  
  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      {publicRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<route.component />}
        />
      ))}

      {/* User Routes - Only for logged-in users */}
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

      {/* Admin Routes - Only for admin users */}
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

      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;