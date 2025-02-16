import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateOtp } from '../redux/authSlice';
import '../styles/AuthLogin.css';
import Navbar from '../components/Navbars';
// Utility function to sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[^0-9]/g, ''); // Ensures only numbers are allowed
};

const AuthLogin = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  const authError = useSelector((state) => state.auth.error);

  // Prevent back & forward navigation
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

  const handleOtpValidation = async () => {
    const sanitizedOtp = sanitizeInput(otp);

    if (sanitizedOtp.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      console.log('Dispatching validateOtp with:', { email, otp: sanitizedOtp });
      const resultAction = await dispatch(validateOtp({ email, otp: sanitizedOtp }));

      if (validateOtp.fulfilled.match(resultAction)) {
        alert("Login Successfully");
        console.log('OTP validation successful:', resultAction.payload);
        const { role } = resultAction.payload;

        switch (role) {
          case 'user':
            navigate('/roleuser', { replace: true }); // Prevent back navigation
            break;
          case 'guest':
            navigate('/roleguest', { replace: true }); // Prevent back navigation
            break;
          default:
            alert('Unknown role');
        }
      } else {
        console.log('OTP validation failed:', resultAction.payload);
        alert(resultAction.payload || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      alert('Error validating OTP. Please try again.');
    }
  };

  return (<div><Navbar />
    <div className="auth-login-container">
      
      <h2>Multi-Factor Authentication</h2>
      {authError && <p className="error-message">{authError}</p>}
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        maxLength="6"
        pattern="[0-9]*"
      />
      <button onClick={handleOtpValidation}>Validate OTP</button>
    </div></div>
  );
};

export default AuthLogin;