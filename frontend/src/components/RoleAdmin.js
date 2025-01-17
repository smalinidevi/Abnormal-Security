import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleUser.css'; // Import the CSS file

const RoleAdmin = () => {
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
      <h1>Admin Options</h1>    
      <button onClick={handleDownloadFile}>Download File</button>
      <button onClick={handleUploadFile}>Upload File</button>
      <button onClick={handleShareFile}>Share File</button>
      <button onClick={handleShareFile}>View File</button>
      <button onClick={handleShareFile}>Delete File</button>
    </div>
  );
};

export default RoleAdmin;