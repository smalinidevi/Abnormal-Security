// src/redux/fileShareSlice.js
import { createSlice } from '@reduxjs/toolkit';

const fileShareSlice = createSlice({
  name: 'fileShare',
  initialState: {
    shareLink: '',
    loading: false,
    error: null,
  },
  reducers: {
    generateLinkStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    generateLinkSuccess: (state, action) => {
      state.loading = false;
      state.shareLink = action.payload;
    },
    generateLinkFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { generateLinkStart, generateLinkSuccess, generateLinkFailure } = fileShareSlice.actions;
export default fileShareSlice.reducer;