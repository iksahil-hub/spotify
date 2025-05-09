import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../Services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      setError('Incorrect username or password.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#121212',
      fontFamily: 'Arial, sans-serif',
      color: '#fff',
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
      marginBottom: '30px',
      fontWeight: 'bold',
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
    error: {
      color: '#e22134',
      fontSize: '12px',
      marginBottom: '12px',
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
        <div style={styles.title}>Log in to Spotify</div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Log In</button>
        </form>
        <a href="/signup" style={styles.link}>Don't have an account? Sign up</a>
        <a href="#" style={styles.link}>Forgot your password?</a>
      </div>
    </div>
  );
};

export default Login;
