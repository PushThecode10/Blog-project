import { createSlice } from '@reduxjs/toolkit';

console.log(localStorage.getItem('accessToken'));

const initialState = {
  isAuthenticated: !!localStorage.getItem('accessToken'), // stays logged in on refresh
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // optional: store user data
    },
    logout: (state) => {
      
      state.isAuthenticated = false;
       state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      
     
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
