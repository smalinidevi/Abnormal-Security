// src/redux/fileSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { getUsers, fetchFiles, uploadFile, decryptFile, fetchSharedFileData } from '../api/fileapi'; // Import API functions

const initialState = {
  users: [],
  files: [],
  permissions: [],
  selectedUser: '',
  selectedFile: '',
  selectedPermission: '',
  selectedFileId: '',
  loading: false,
  error: null,
  message: null,
  status: "idle",
  senders: [],
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setSelectedPermission: (state, action) => {
      state.selectedPermission = action.payload;
    },
    setSelectedFileId: (state, action) => {
      state.selectedFileId = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setSharedFileData: (state, action) => {
      state.senders = action.payload.senders;
      state.users = action.payload.users;
      state.filesData  = action.payload;
      state.permissions = action.payload.permissions;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setUsers,
  setFiles,
  setPermissions,
  setSelectedUser,
  setSelectedFile,
  setSelectedPermission,
  setSelectedFileId,
  setLoading,
  setError,
  setMessage,
  setSharedFileData,
  setStatus,
} = fileSlice.actions;

export const fetchUsers = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const users = await getUsers(email);
    dispatch(setUsers(users));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Failed to fetch users'));
    dispatch(setLoading(false));
  }
};

export const fetchFileList = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const files = await fetchFiles(email);
    dispatch(setFiles(files));
  } catch (error) {
    dispatch(setError("Failed to fetch files"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const uploadFileAction = (formData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await uploadFile(formData);
    console.log(response);
    dispatch(setMessage('File uploaded successfully'));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const downloadFileAction = (fileName) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const fileData = await decryptFile(fileName);
    const url = window.URL.createObjectURL(new Blob([fileData]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    dispatch(setMessage('File downloaded successfully'));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const fetchSharedFileDataAction = (sender) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const data = await fetchSharedFileData(sender);
    if (data?.files?.length > 0) {
      dispatch(setSharedFileData({ files: data.files })); // Store only the files array
      dispatch(setStatus("succeeded"));
    } else {
      dispatch(setError("No shared files found"));
      dispatch(setStatus("failed"));
    }
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setStatus("failed"));
  }
};




export default fileSlice.reducer;