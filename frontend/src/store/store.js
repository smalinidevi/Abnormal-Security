// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import fileReducer from './fileSlice'; 
import fileShareReducer from './fileShareSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReducer,fileShareReducer
  },
});
 
export default store;