import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setRole } from '../store/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/AuthLogin.css'; 
const AuthLogin = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  
  const handleLogin = async () => {
    if (otp.length !== 6) {
      alert('Please enter a 6-digit OTP.');
      return;
    }
    try {
        const response = await fetch(`http://127.0.0.1:8000/validate-otp/${email}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            otp:otp,
           }),
        });
      if (response.ok) {
        const data = await response.json();
        dispatch(setRole(data.role || 'user'));
        alert('OTP is valid');
        navigate('/rolebased'); // Redirect to file.js or wherever you want
      } else {
        alert('OTP is incorrect');
      }
    } catch (error) {
      alert('Error validating OTP');
    }
  };
 
  return (
    <div>
      <nav className="navbar">
      <div className="navbar-brand">
        <h2>Secure File Sharing</h2>
      </div></nav>
      <div className="auth-login-container">
      <h2>Multi Factor Authentication</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleLogin}>Validate OTP</button>
    </div></div>
  );
};
 
export default AuthLogin;