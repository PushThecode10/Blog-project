// Features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// 🔥 Read user safely from localStorage
let savedUser = localStorage.getItem("user");
//initial satate
const initialState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  user:
    savedUser && savedUser !== "undefined"
      ? JSON.parse(savedUser)
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      // Always store valid JSON
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
