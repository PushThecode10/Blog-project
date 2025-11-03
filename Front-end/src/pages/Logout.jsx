// Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    // ✅ Read role BEFORE clearing localStorage

    // Clear all authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    // Redirect based on role
    console.log(role);
    
    if (role === "admin") {
      navigate("/adminLogin"); // admin login page
    } else {
      navigate("/"); // normal user home page
    }
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
