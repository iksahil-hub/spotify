import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '0.5rem 1rem',
        background: '#1db954',
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
