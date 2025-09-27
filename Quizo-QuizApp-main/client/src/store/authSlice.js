import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      // Clear token from localStorage on logout
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;

// Helper functions to check user roles
export const selectUserRole = (state) => state.auth.userData?.userType;
export const selectIsStudent = (state) => state.auth.userData?.userType === 'student';
export const selectIsFaculty = (state) => state.auth.userData?.userType === 'faculty';
export const selectIsAdmin = (state) => state.auth.userData?.userType === 'admin';
export const selectIsAuthenticated = (state) => state.auth.status;

export default authSlice.reducer;
