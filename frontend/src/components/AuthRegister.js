import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/AuthRegister.css'; 
const AuthRegister = () => {
 
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  let qrCodeUrl = '';
 
  // Fetch QR code for registration
  const fetchQrCode = async () => {
    try {
        const res = await fetch(`http://127.0.0.1:8000/get-qr/${email}/`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        qrCodeUrl = data.qr_code_path;  // Get the QR code URL from the response
        displayQrCode(qrCodeUrl); // Display QR code
      } 
    } catch (error) {
      alert('Error fetching QR code');
    }
  };
 
  // Function to display QR code dynamically
  const displayQrCode = (qrCodeUrl) => {
    const qrCodeImage = document.getElementById('qrCodeImage');
    qrCodeImage.src = `http://127.0.0.1:8000/static${qrCodeUrl}`;
  };
 
  // OTP validation function
  const handleRegister = async (otp) => {
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
        
        alert('Registration successful');
        navigate('/login'); // Redirect to file.js or wherever you want after successful registration
      } else {
        alert('OTP is incorrect');
      }
    } catch (error) {
      alert('Error validating OTP');
    }
  };
 
  useEffect(() => {
    if (email) {
      fetchQrCode(); // Fetch QR code when component is mounted
    }
  }, [email]);
 
  return (
    <div>
      <nav className="navbar">
      <div className="navbar-brand">
        <h2>Secure File Sharing</h2>
      </div></nav>
      <div className="auth-register-container">
      <div>
        <h3>Scan this QR Code with Google Authenticator</h3>
        <img id="qrCodeImage" alt="QR Code" />
      </div>
 
      <input
        type="text"
        id="otpInput"
        placeholder="Enter OTP"
        maxLength="6"
      />
      <button onClick={() => handleRegister(document.getElementById('otpInput').value)}>
        Complete Registration
      </button>
    </div></div>
  );
};
 
export default AuthRegister;