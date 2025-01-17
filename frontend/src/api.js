import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://localhost:8000', // Backend URL
  withCredentials: true,  // Include credentials (cookies) in requests
  headers: {
    'Content-Type': 'application/json',  // Default content type
  },
});

// Function to handle file upload
const uploadFile = async (formData) => {
  const token = localStorage.getItem('token'); // Retrieve token from local storage

  // Check if token exists
  if (!token) {
    console.error('No token found. Please log in.');
    return;
  }

  try {
    // Send POST request to upload file
    const response = await api.post('/upload-file/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Attach the token to Authorization header
        'Content-Type': 'multipart/form-data', // Required for file uploads
      },
    });

    // Handle the success response
    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    // Handle error if the upload fails
    console.error('Upload failed:', error.response ? error.response.data : error.message);
  }
};

export default api;