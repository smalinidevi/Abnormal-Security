import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to SafeStream Secure File Sharing</h1>
      <p>
        Share your files securely with end-to-end encryption. Your privacy is our top priority.
      </p>
      <p>
        We provide a safe and encrypted platform for file sharing. Our goal is to ensure the privacy and security of your data, allowing you to share files securely with anyone, anywhere.
      </p>
      <p>
        Enjoy seamless file sharing with industry-leading encryption standards. Your files are always protected.
      </p>

      {/* Buttons Section */}
      <div className="button-container">
        <Link to="/register">
          <button className="register-button">Register</button>
        </Link>
        <Link to="/login">
          <button className="login-button">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
