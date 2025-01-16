import api from '../api';
import { useDispatch } from 'react-redux';
import { setEmail, setAuthentication } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const Login = () => {
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/login/', {
        email: email.trim(),
        password: password.trim(),
      });
      const { token } = response.data;

      // Store token in secure HttpOnly cookie
      document.cookie = `token=${token}; Secure; HttpOnly; SameSite=Strict;`;

      dispatch(setEmail(email));
      dispatch(setAuthentication(true));
      navigate('/auth-login', { state: { email } });
    } catch (error) {
      alert('Login failed');
    }
  };
  return (
    <div>
      <nav className="navbar">
      <div className="navbar-brand">
        <h2>Secure File Sharing</h2>
      </div></nav>
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