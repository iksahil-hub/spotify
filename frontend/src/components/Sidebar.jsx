// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiBook, FiPlusSquare, FiHeart } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <div>
        <div style={styles.logo}>
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png"
            alt="Spotify"
            style={{ width: '130px', marginBottom: '30px' }}
          />
        </div>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}><FiHome style={styles.icon} />Home</Link>
          <Link to="/search" style={styles.link}><FiSearch style={styles.icon} />Search</Link>
          <Link to="/library" style={styles.link}><FiBook style={styles.icon} />Your Library</Link>
        </nav>
      </div>
      <div style={styles.library}>
        <Link to="/create-playlist" style={styles.link}><FiPlusSquare style={styles.icon} />Create Playlist</Link>
        <Link to="/liked" style={styles.link}><FiHeart style={styles.icon} />Liked Songs</Link>
      </div>
    </div>
    
  );
};

const styles = {
  sidebar: {
    backgroundColor: '#000',
    color: '#b3b3b3',
    padding: '20px',
    width: '230px',
    height: '100vh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  logo: {
    marginBottom: '30px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  library: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#b3b3b3',
    fontSize: '16px',
    gap: '15px',
    transition: 'color 0.2s ease',
  },
  icon: {
    fontSize: '20px',
  },
};

export default Sidebar;
