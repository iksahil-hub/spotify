import React, { useState, useEffect } from 'react';
import { FaListUl, FaTimes, FaPlay } from 'react-icons/fa';
import axios from 'axios';

const QueueProfile = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch queue from Spotify API
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const token = localStorage.getItem('spotify_token');
        const response = await axios.get('https://api.spotify.com/v1/me/player/queue', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQueue(response.data.queue || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load queue');
        setLoading(false);
        console.error('Queue fetch error:', err);
      }
    };

    fetchQueue();
    
    // Refresh queue every 10 seconds
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRemove = async (trackId) => {
    try {
      const token = localStorage.getItem('spotify_token');
      await axios.delete(`https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setQueue(queue.filter(item => item.id !== trackId));
    } catch (err) {
      console.error('Error removing from queue:', err);
    }
  };

  const handlePlayNext = (trackId) => {
    // Implement play next functionality
    console.log('Play next:', trackId);
  };

  if (loading) return <div style={styles.loading}>Loading queue...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FaListUl style={styles.icon} />
        <h2 style={styles.title}>Queue</h2>
        <button 
          style={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div style={styles.body}>
        {queue.length === 0 ? (
          <p style={styles.text}>Your queue is empty</p>
        ) : (
          <div style={styles.queueList}>
            {isExpanded ? (
              queue.map((track, index) => (
                <div key={`${track.id}-${index}`} style={styles.queueItem}>
                  <img 
                    src={track.album.images[0]?.url || '/default-thumbnail.png'} 
                    alt={track.name} 
                    style={styles.thumbnail}
                  />
                  <div style={styles.trackInfo}>
                    <p style={styles.trackName}>{track.name}</p>
                    <p style={styles.artistName}>
                      {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                  </div>
                  <div style={styles.queueActions}>
                    <button 
                      style={styles.actionButton}
                      onClick={() => handlePlayNext(track.id)}
                      title="Play Next"
                    >
                      <FaPlay size={16} />
                    </button>
                    <button 
                      style={styles.removeButton}
                      onClick={() => handleRemove(track.id)}
                      title="Remove"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.collapsedView}>
                <p style={styles.text}>Up Next: {queue[0].name} - {queue[0].artists[0].name}</p>
                <p style={styles.queueCount}>{queue.length} songs in queue</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    color: 'white',
    backgroundColor: '#282828',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    borderBottom: '1px solid #333',
    paddingBottom: '15px',
  },
  icon: {
    fontSize: '24px',
    color: '#1DB954',
  },
  title: {
    fontSize: '22px',
    margin: 0,
    fontWeight: 600,
  },
  toggleButton: {
    background: 'transparent',
    border: '1px solid #1DB954',
    color: '#1DB954',
    padding: '8px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  body: {
    backgroundColor: '#181818',
    padding: '20px',
    borderRadius: '6px',
  },
  text: {
    fontSize: '16px',
    color: '#b3b3b3',
    margin: 0,
  },
  queueList: {
    maxHeight: '400px',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
  },
  queueItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #333',
    transition: 'background 0.2s ease',
    ':hover': {
      backgroundColor: '#282828',
    },
  },
  thumbnail: {
    width: '50px',
    height: '50px',
    borderRadius: '4px',
    marginRight: '15px',
    objectFit: 'cover',
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 500,
    color: 'white',
  },
  artistName: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#b3b3b3',
  },
  queueActions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    ':hover': {
      backgroundColor: '#333',
    },
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    color: '#b3b3b3',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    ':hover': {
      backgroundColor: '#333',
      color: 'white',
    },
  },
  collapsedView: {
    padding: '15px',
    backgroundColor: '#282828',
    borderRadius: '6px',
  },
  queueCount: {
    color: '#b3b3b3',
    fontSize: '14px',
    margin: '8px 0 0',
  },
  loading: {
    padding: '20px',
    color: '#b3b3b3',
    textAlign: 'center',
  },
  error: {
    padding: '20px',
    color: '#ff5555',
    textAlign: 'center',
  },
};

export default QueueProfile;