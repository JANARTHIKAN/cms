import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Memoize handleGoogleResponse with useCallback
  const handleGoogleResponse = useCallback(async (response) => {
    try {
      const res = await axios.post('https://contact-manager-server-up3q.onrender.com/api/google-login', {
        token: response.credential,
      });

      if (res.status === 200) {
        const { token, userId } = res.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        alert("Google Login successful!");
        navigate('/contacts');
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Google Login failed. Please try again.");
    }
  }, [navigate]);

  // useEffect for Google Sign-In initialization
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: "296322839269-daok1kt28p4h2lk37et9418vmeplq2em.apps.googleusercontent.com", // Replace with your Google Client ID
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );
  }, [handleGoogleResponse]); // Stable dependency due to useCallback

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://contact-manager-server-up3q.onrender.com/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, userId } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        alert("Login successful!");
        navigate('/contacts');
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2>Contact Manager !</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button">Log In</button>

          {/* Google Sign-In button container */}
          <div id="googleSignInDiv"></div>
        </form>
        <p>
          <br />
          Don’t have an account?{" "}
          <span onClick={goToSignup} className="signup-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
