import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadFileSuccess, downloadFileFailure } from '../store/fileSlice';
import api from '../api'; // Import the axios instance

const FileDownload = () => {
  const [filename, setFilename] = useState('');
  const [key, setKey] = useState('');
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.file);

  // Fetch the list of files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get('/list-files/');
        setFiles(response.data.files); // Set the list of files in state
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []); // Empty dependency array to fetch files only once when the component mounts

  // Handle filename change
  const handleFilenameChange = (e) => {
    setFilename(e.target.value);
  };

  // Handle key change
  const handleKeyChange = (e) => {
    setKey(e.target.value);
  };

  // Handle download request
  const handleDownload = async () => {
    if (!filename || !key) {
      alert('Please enter both filename and encryption key.');
      return;
    }

    try {
      const response = await api.post('/download-file/', { filename, key }, {
        responseType: 'blob', // To handle binary file response
      });

      // Check if file download is successful
      if (response.data) {
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename; // Name of the file to be downloaded
        link.click();

        dispatch(downloadFileSuccess('File downloaded successfully.'));
      }
    } catch (error) {
      // Handle error
      const errorMessage = error.response?.data?.error || 'An error occurred.';
      dispatch(downloadFileFailure(errorMessage));
    }
  };

  return (
    <div>
      <h1>File Download</h1>

      {/* Dropdown to select the file */}
      <select value={filename} onChange={handleFilenameChange}>
        <option value="">Select a file</option>
        {files.map((file, index) => (
          <option key={index} value={file}>
            {file}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Enter Encryption Key"
        value={key}
        onChange={handleKeyChange}
      />
      <button onClick={handleDownload}>Download File</button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileDownload;