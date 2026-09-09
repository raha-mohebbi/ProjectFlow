import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
    },

    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;