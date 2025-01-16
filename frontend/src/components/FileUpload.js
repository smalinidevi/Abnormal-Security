import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFileAction } from '../store/fileSlice'; // Import the upload action

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const dispatch = useDispatch(); // Initialize dispatch
  const { message, error } = useSelector((state) => state.file); // Access state from fileSlice

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle key input
  const handleKeyChange = (e) => {
    setKey(e.target.value);
  };

  // Handle file upload
  const handleUpload = () => {
    if (!file || !key) {
      alert('Please select a file and enter a key.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);

    // Dispatch the Redux action
    dispatch(uploadFileAction(formData));
  };

  return (
    <div>
      <h1>File Upload with Encryption</h1>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter Encryption Key"
        value={key}
        onChange={handleKeyChange}
      />
      <button onClick={handleUpload}>Upload File</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;