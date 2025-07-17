// src/components/HomeContent.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { usePlayer } from '../context/PlayerContext';

const HomeContent = () => {
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axiosInstance.get('/songs');
        setSongs(response.data);
      } catch (err) {
        console.error("Failed to fetch songs", err);
        setError("Failed to load songs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return <div style={styles.loader}>Loading songs...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Explore Songs</h2>
      <div style={styles.grid}>
        {songs.map((song) => (
          <div
            key={song._id || song.id}
            onClick={() => playSong(song)}
            style={styles.card}
          >
            <h4 style={styles.title}>{song.title}</h4>
            <p style={styles.artist}>{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    color: '#fff',
    backgroundColor: '#121212',
    minHeight: '100vh',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.8rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: '1rem',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease-in-out',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '1.1rem',
    marginBottom: '0.3rem',
  },
  artist: {
    fontSize: '0.9rem',
    color: '#999',
  },
  loader: {
    padding: '2rem',
    color: '#ccc',
    fontSize: '1.2rem',
  },
  error: {
    padding: '2rem',
    color: '#ff6b6b',
    fontSize: '1.2rem',
  },
};

export default HomeContent;
