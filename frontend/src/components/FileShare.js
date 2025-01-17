// src/components/ShareFile.js
import React, { useState } from 'react';

const ShareFile = () => {
  const [fileId, setFileId] = useState(''); // Track the file ID input
  const [shareLink, setShareLink] = useState(''); // Track the generated share link
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(''); // Track any errors

  const handleGenerateLink = async () => {
    if (!fileId) {
      alert('Please enter a file ID');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://localhost:8000/api/generate-view-link/${fileId}/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setShareLink(data.url); // Set the share link if successful
      } else {
        const data = await response.json();
        setError(data.error || 'Error generating link');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false); // Stop loading after the operation
    }
  };

  return (
    <div>
      <h1>Share File</h1>
      <input
        type="text"
        placeholder="Enter file ID"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)} // Update file ID input
      />
      <button onClick={handleGenerateLink} disabled={loading}>
        {loading ? 'Generating link...' : 'Generate Expirable Link'}
      </button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      {shareLink && (
        <div>
          <h2>Your Expirable View Link</h2>
          <a href={shareLink} target="_blank" rel="noopener noreferrer">
            {shareLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default ShareFile;