import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFileList, downloadFileAction, setMessage, setError } from '../redux/fileSlice';
import Navbar from '../components/Navbar';

const FileDownload = () => {
  const [selectedFile, setSelectedFile] = useState('');
  const dispatch = useDispatch();
  const email = useSelector((state) => state.auth.email);
  const { files = [], message, error, loading } = useSelector((state) => state.file);

  useEffect(() => {
    if (email) {
      dispatch(fetchFileList(email));
    }
  }, [dispatch, email]);

  const handleFileChange = (e) => setSelectedFile(e.target.value);

  const handleDownload = () => {
    dispatch(setMessage(null));
    dispatch(setError(null));
    if (!selectedFile) {
      alert('Please select a file to download.');
      return;
    }
    dispatch(downloadFileAction(selectedFile));
  };

  return (
    <div><Navbar />
      <h1>Download Decrypted File</h1>
      <p>Logged in as: <strong>{email}</strong></p>

      <select onChange={handleFileChange} value={selectedFile}>
        <option value="">Select a file</option>
        {files.map((file) => (
          <option key={file.filename} value={file.filename}>
            {file.filename}
          </option>
        ))}
      </select>

      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Downloading...' : 'Download File'}
      </button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileDownload;