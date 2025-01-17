import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleUser.css'; // Import the CSS file

const RoleUser = () => {
  const navigate = useNavigate();

  const handleDownloadFile = () => {
    navigate('/filedownload'); // Navigate to download file page
  };

  const handleUploadFile = () => {
    navigate('/fileupload'); // Navigate to upload file page
  };

  const handleShareFile = () => {
    navigate('/fileshare'); // Navigate to share file page
  };

  return (
    <div>
      <h1>User Options</h1>
      <button onClick={handleDownloadFile}>Download File</button>
      <button onClick={handleUploadFile}>Upload File</button>
      <button onClick={handleShareFile}>Share File</button>
    </div>
  );
};

export default RoleUser;