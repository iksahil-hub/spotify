// src/components/Library.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserPlaylists, getFavorites } from '../Services/api';

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const [plRes, favRes] = await Promise.all([
          getUserPlaylists(),
          getFavorites()
        ]);
        setPlaylists(plRes.data || []);
        setFavorites(favRes.data || []);
      } catch (err) {
        console.error('Failed to load library:', err);
        setError('Could not load your library.');
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  if (loading) return <p style={styles.message}>Loading your library...</p>;
  if (error) return <p style={{ ...styles.message, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Playlists</h2>
      <div style={styles.grid}>
        {playlists.map(pl => (
          <div key={pl.id} style={styles.card}>
            <Link to={`/playlist/${pl.id}`} style={styles.link}>
              <div style={styles.cardTitle}>{pl.name}</div>
            </Link>
          </div>
        ))}
      </div>

      <h2 style={styles.heading}>Liked Songs</h2>
      <div style={styles.grid}>
        {favorites.map(song => (
          <div key={song.id} style={styles.card}>
            <Link to={`/song/${song.id}`} style={styles.link}>
              <div style={styles.cardTitle}>{song.title}</div>
              <div style={styles.cardSub}>{song.artist}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: '#fff',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    fontSize: '1.5rem',
    margin: '20px 0 10px',
    fontWeight: 'bold'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px'
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s ease-in-out'
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '6px'
  },
  cardSub: {
    fontSize: '14px',
    color: '#b3b3b3'
  },
  message: {
    padding: '20px',
    color: '#fff'
  }
};

export default Library;
