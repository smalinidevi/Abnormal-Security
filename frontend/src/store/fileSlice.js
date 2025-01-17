
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
 

// Async thunk to handle file upload
export const uploadFileAction = createAsyncThunk('file/uploadFile',
  async (formData, { rejectWithValue }) => {
    try {
        const response = await fetch('https://localhost:8000/upload-file/', {
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

// Add downloadFileSuccess and downloadFileFailure reducers
export const downloadFileSuccess = (state, action) => {
  state.message = action.payload;
  state.error = null;
};

export const downloadFileFailure = (state, action) => {
  state.error = action.payload;
  state.message = null;
};
 


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

export default fileSlice.reducer;