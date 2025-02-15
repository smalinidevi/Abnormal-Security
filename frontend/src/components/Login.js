import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmail, setAuthentication, setToken } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle login and token storage
  const handleLogin = async () => {
    try {
      const response = await api.post('/login/', {
        email: email.trim(),
        password: password.trim(),
      });

      const { access, refresh } = response.data;

      // Store both tokens in secure HttpOnly cookies
      document.cookie = `access=${access}; Secure; HttpOnly; SameSite=Strict;`;
      document.cookie = `refresh=${refresh}; Secure; HttpOnly; SameSite=Strict;`;

      dispatch(setEmail(email));
      dispatch(setAuthentication(true));
      dispatch(setToken(access)); // Store access token in Redux

      navigate('/auth-login', { state: { email } });
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-box">
          <h1>Login</h1>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            New user?{' '}
            <button onClick={() => navigate('/register', { replace: true })}>
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;