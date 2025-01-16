import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
 
// Async thunk to handle file upload
export const uploadFileAction = createAsyncThunk('file/uploadFile',
  async (formData, { rejectWithValue }) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Upload failed');
      }
      return data.message;
    } catch (error) {
      return rejectWithValue('Something went wrong while uploading the file');
    }
  }
);
 
const fileSlice = createSlice({
  name: 'file',
  initialState: {
    message: '',
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadFileAction.fulfilled, (state, action) => {
        state.message = action.payload;
        state.error = '';
      })
      .addCase(uploadFileAction.rejected, (state, action) => {
        state.error = action.payload;
        state.message = '';
      });
  },
});
 
export default fileSlice.reducer;