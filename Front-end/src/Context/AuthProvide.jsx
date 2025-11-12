// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../axios"; // your axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for initial fetch



  const fetchUser = async () => {

     const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("⚠️ Please login first");
      return;
    }

    try {
      const res = await API.get("/auth/me", { withCredentials: true });
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const logout = async () => {
  try {
    await API.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);  // Clear user from context
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser,logout }}>
      {children}
    </AuthContext.Provider>
  );
  }

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
