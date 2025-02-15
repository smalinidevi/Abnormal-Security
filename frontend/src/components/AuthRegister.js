import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/AuthRegister.css';

const AuthRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  // Fetch QR code for registration
  const fetchQrCode = async () => {
    if (!email) {
      setError('Email is missing. Please try again.');
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/get-qr/${email}/`, {
        method: 'GET',
      });

      if (res.ok) {
        const blob = await res.blob();  // Get the response as a blob
        const qrCodeUrl = URL.createObjectURL(blob);  // Create a local URL for the image
        setQrCodeUrl(qrCodeUrl);
      } else {
        setError('Failed to fetch QR code. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching QR code:', err);
      setError('Error fetching QR code. Please check your network connection.');
    }
  };

  // OTP validation function
  const handleRegister = async () => {
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/validate-otp/${email}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      if (res.ok) {
        alert('Registration successful');
        navigate('/login');
      } else {
        alert('Incorrect OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error validating OTP:', err);
      alert('Error validating OTP. Please check your network connection.');
    }
  };

  useEffect(() => {
    fetchQrCode();
  }, [email]);

  return (
    <div>

      <div className="auth-register-container">
        <div>
          <h3>Scan this QR Code with Google Authenticator</h3>
          {qrCodeUrl ? (
            <img id="qrCodeImage" src={qrCodeUrl} alt="QR Code" />
          ) : (
            <p>{error || 'Loading QR Code...'}</p>
          )}
        </div>

        <input
          type="text"
          id="otpInput"
          placeholder="Enter OTP"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleRegister}>Complete Registration</button>
      </div>
    </div>
  );
};

export default AuthRegister;