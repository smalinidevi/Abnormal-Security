import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQR, validateOTP } from '../api/api';
import api from '../api/api';

const initialState = {
  email: null,
  role: null,
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  refreshToken: null,
  qrCodeUrl: null,
  loading: false,
  error: null,
};

export const fetchQrCode = createAsyncThunk(
  'auth/fetchQrCode',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetchQR(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateOtp = createAsyncThunk(
  'auth/validateOtp',
  async ({ email, otp }, { rejectWithValue, getState }) => {
    try {
      const response = await validateOTP(email, otp);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'OTP validation failed');
    }
  }
);


export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await api.post('/login/', { email, password });
    console.log('Login API Response:', response.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    
    setEmail(state, action) {
      state.email = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setAuthentication(state, action) {
      state.isAuthenticated = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
    logout(state) {
      Object.assign(state, initialState);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

    .addCase(loginUser.fulfilled, (state, action) => {
      state.token = action.payload.access;
      localStorage.setItem('token', action.payload.access);
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload;
    })


      .addCase(fetchQrCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQrCode.fulfilled, (state, action) => {
        state.qrCodeUrl = action.payload.qr_code_url;
        state.loading = false;
      })
      .addCase(fetchQrCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(validateOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateOtp.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.loading = false;
        state.error = null;
      })
      .addCase(validateOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setEmail,
  setRole,
  setAuthentication,
  setToken,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;