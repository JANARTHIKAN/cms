// src/components/Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        alert("Account created successfully. Please log in.");
        navigate('/login');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.header}>Sign Up</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Create Account</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#121212',
  },
  box: {
    backgroundColor: '#1c1c1c',
    padding: '40px',
    borderRadius: '10px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    color: '#fff',
    textAlign: 'center',
  },
  header: {
    marginBottom: '20px',
    fontSize: '1.8em',
    color: '#ff4b2b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    marginBottom: '5px',
    fontSize: '0.9em',
    color: '#aaa',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #333',
    borderRadius: '25px',
    background: '#333',
    color: '#fff',
    fontSize: '1em',
    outline: 'none',
  },
  button: {
    padding: '12px',
    border: 'none',
    borderRadius: '25px',
    background: 'linear-gradient(90deg, #ff416c, #ff4b2b)',
    color: '#fff',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
  },
};

export default Signup;
