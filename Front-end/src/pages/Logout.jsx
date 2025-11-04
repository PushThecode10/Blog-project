import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Features/auth/authSlice.js";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");

  useEffect(() => {
    dispatch(logout()); // update redux state

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    if (role === "admin") navigate("/adminLogin");
    else navigate("/");
  }, [dispatch, navigate, role]);

  return <div>Logging out...</div>;
};

export default Logout;
