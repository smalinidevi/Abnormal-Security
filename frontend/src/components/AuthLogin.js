import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateOtp } from '../redux/authSlice';
import '../styles/AuthLogin.css';

const AuthLogin = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const authError = useSelector((state) => state.auth.error);

  const handleOtpValidation = async () => {
    if (otp.length !== 6) {
      alert('Please enter a 6-digit OTP.');
      return;
    }
  
    try {
      console.log('Dispatching validateOtp with:', { email, otp });
      const resultAction = await dispatch(validateOtp({ email, otp }));
  
      if (validateOtp.fulfilled.match(resultAction)) {
        console.log('OTP validation successful:', resultAction.payload);
        const { role } = resultAction.payload;
  
        if (role === 'user') {
          navigate('/roleuser');
        } else if (role === 'guest') {
          navigate('/guest');
        } else {
          alert('Unknown role');
        }
      } else {
        console.log('OTP validation failed:', resultAction.payload);
        alert(resultAction.payload || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      alert('Error validating OTP');
    }
  };
  

  return (
    <div className="auth-login-container">
      <h2>Multi-Factor Authentication</h2>
      {authError && <p className="error-message">{authError}</p>}
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleOtpValidation}>Validate OTP</button>
    </div>
  );
};

export default AuthLogin;