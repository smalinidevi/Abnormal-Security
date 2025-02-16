import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RoleUser.css'; // Import the CSS file
import Navbar from '../components/Navbar';

const RoleGuest = () => {
  const navigate = useNavigate();

  // Prevent Back & Forward Navigation
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      navigate('/home', { replace: true }); // Redirect to home on back press
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);


  const handleShowFile = () => {
    navigate('/SharedFile'); // Navigate to shared file page
  };

  return (
    <div><Navbar />
      <h1>User Options</h1>
      <button onClick={handleShowFile}>Shared File</button>
    </div>
  );
};

export default RoleGuest;
