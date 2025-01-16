import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmail, setAccess } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils';
import '../styles/Register.css';
 
const Register = () => {
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [name, setNameInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [access, setAccessLevel] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleRegister = async () => {
    if (!validateEmail(email)) {
      alert('Invalid email format');
      return;
    }
    if (!validatePassword(password)) {
      alert('Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!access) {
      alert('Please select an access level');
      return;
    }
 
    try {
const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(), // Ensure no leading/trailing spaces
          name: name.trim(),
          password: password.trim(),
          access: access.trim(),
          confirm_password: confirmPassword.trim(),
        }),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || 'Registration failed');
        return;
      }
 
      const data = await response.json();
      alert('Please Complete Multi-Factor Authentication');
      dispatch(setEmail(email)); // Store email in Redux
      dispatch(setAccess(access));
      navigate('/auth-register', { state: { email } });
    } catch (err) {
      alert('Registration failed');
    }
  };
 
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>Secure File Sharing</h2>
        </div>
      </nav>
      <div className="register-container">
        <div className="register-box">
          <h1>Register</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Email"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Name"
          />
          <select value={access} onChange={(e) => setAccessLevel(e.target.value)}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <button onClick={handleRegister}>Register</button>
          <p>
            Already have an account?{' '}
            <button onClick={() => navigate('/login', { replace: true })}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
 
export default Register;