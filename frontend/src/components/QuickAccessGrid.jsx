import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuickAccessGrid = ({ onPlaylistClick }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = localStorage.getItem('spotify_token');
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: 12,
            offset: 0
          }
        });
        
        setPlaylists(response.data.items);
        setLoading(false);
      } catch (err) {
        setError('Failed to load playlists');
        setLoading(false);
        console.error('Playlist fetch error:', err);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) return <div className="loading-placeholder">Loading playlists...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="quick-access-grid">
      {playlists.map((playlist) => (
        <div 
          key={playlist.id} 
          className="playlist-card"
          onClick={() => onPlaylistClick(playlist.id)}
        >
          <div className="playlist-image-container">
            <img 
              src={playlist.images[0]?.url || '/default-playlist.png'} 
              alt={playlist.name}
              className="playlist-image"
            />
          </div>
          <div className="playlist-info">
            <h3 className="playlist-title">{playlist.name}</h3>
            <p className="playlist-description">
              {playlist.description || `${playlist.tracks.total} tracks`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Add this CSS to your stylesheet
const styles = {
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '30px',
  },
  playlistCard: {
    backgroundColor: '#282828',
    borderRadius: '8px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    },
  },
  playlistImageContainer: {
    position: 'relative',
    marginBottom: '12px',
    paddingBottom: '100%', // 1:1 aspect ratio
    overflow: 'hidden',
    borderRadius: '6px',
  },
  playlistImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  playlistInfo: {
    overflow: 'hidden',
  },
  playlistTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  playlistDescription: {
    margin: 0,
    fontSize: '12px',
    color: '#b3b3b3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  loadingPlaceholder: {
    padding: '20px',
    textAlign: 'center',
    color: '#b3b3b3',
  },
  errorMessage: {
    padding: '20px',
    textAlign: 'center',
    color: '#ff5555',
  },
};

// Apply styles to components
const StyledQuickAccessGrid = () => (
  <div style={styles.quickAccessGrid}>
    {/* The component will render inside this styled container */}
  </div>
);

export default QuickAccessGrid;