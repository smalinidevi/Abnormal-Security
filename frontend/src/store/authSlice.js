import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  role: null,
  isAuthenticated: false,
  token: null, // Store token
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload; // Store token on login
    },
    setAccess: (state, action) => {
        state.access = action.payload;
      },
    logout: (state) => {
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { setEmail, setRole, setAuthentication, setToken, logout,setAccess } = authSlice.actions;
export default authSlice.reducer;