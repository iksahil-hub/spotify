import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../Services/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/signup', { email, password, username });
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      setError('Could not sign up. Please check your details and try again.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#121212',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      backgroundColor: '#000',
      padding: '40px',
      borderRadius: '8px',
      width: '360px',
      boxSizing: 'border-box',
      boxShadow: '0 4px 60px rgba(0,0,0,0.5)',
      textAlign: 'center',
    },
    logo: {
      width: '120px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '24px',
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    subtext: {
      fontSize: '14px',
      color: '#b3b3b3',
      marginBottom: '30px',
    },
    input: {
      width: '100%',
      padding: '16px',
      marginBottom: '16px',
      borderRadius: '4px',
      border: 'none',
      background: '#333',
      color: '#fff',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#1DB954',
      border: 'none',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '8px',
    },
    link: {
      display: 'block',
      marginTop: '12px',
      fontSize: '12px',
      color: '#b3b3b3',
      textDecoration: 'none',
    },
    terms: {
      fontSize: '10px',
      color: '#b3b3b3',
      marginTop: '20px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png"
          alt="Spotify Logo"
          style={styles.logo}
        />
        <div style={styles.title}>Sign up for free to start listening.</div>
        <div style={styles.subtext}>No credit card needed.</div>
        {error && <div style={{ color: '#e22134', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Create a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <a href="/login" style={styles.link}>Have an account? Log in</a>
        <div style={styles.terms}>
          By clicking on Sign up, you agree to Spotify's <a href="#" style={{ color: '#1DB954', textDecoration: 'none' }}>Terms and Conditions of Use</a>.
        </div>
      </div>
    </div>
  );
};

export default Signup;
