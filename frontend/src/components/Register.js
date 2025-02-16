import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setEmail, setToken, setAuthentication } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { validateEmail, validatePassword } from "../utils";
import api from "../api/api";
import "../styles/Register.css";
import Navbar from '../components/Navbars';
const Register = () => {
  const [email, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [name, setNameInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [access, setAccessLevel] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sanitizeInput = (input) => DOMPurify.sanitize(input.trim());

  const handleRegister = async () => {
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(name);
    const sanitizedAccess = sanitizeInput(access);

    if (!validateEmail(sanitizedEmail)) {
      alert("Invalid email format");
      return;
    }

    if (!validatePassword(password)) {
      alert(
        "Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/register/", {
        email: sanitizedEmail,
        name: sanitizedName,
        password: sanitizeInput(password),
        access: sanitizedAccess,
      });

      const { access, refresh } = response.data;

      // Secure storage using cookies (Server should ideally handle secure HttpOnly cookies)
      document.cookie = `access=${DOMPurify.sanitize(access)}; Secure; SameSite=Strict;`;
      document.cookie = `refresh=${DOMPurify.sanitize(refresh)}; Secure; SameSite=Strict;`;

      alert("Please Complete Multi-Factor Authentication");

      // Dispatch token and email to Redux
      dispatch(setEmail(sanitizedEmail));
      dispatch(setAuthentication(true));
      dispatch(setToken({ access, refresh }));
      navigate("/auth-register", { state: { email: sanitizedEmail } });
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (<div><Navbar />
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
          Already have an account?{" "}
          <button onClick={() => navigate("/login")}>Login</button>
        </p>
      </div>
    </div></div>
  );
};

export default Register;