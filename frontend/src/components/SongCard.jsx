import React, { useState } from "react";
import { FiHeart, FiPlus, FiList, FiCheck, FiAlertCircle } from "react-icons/fi";

const SongCard = ({ songId, onActionComplete }) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [actionStatus, setActionStatus] = useState({ type: null, message: null });

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const token = localStorage.getItem('spotify_token');
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch song: ${response.status}`);
        }

        const data = await response.json();
        setSong(data);
        
        // Check if song is already liked
        const likedResponse = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${songId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (likedResponse.ok) {
          const [isCurrentlyLiked] = await likedResponse.json();
          setIsLiked(isCurrentlyLiked);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching song:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [songId]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        throw new Error("Authentication required");
      }

      const endpoint = isLiked 
        ? `https://api.spotify.com/v1/me/tracks/${songId}` 
        : `https://api.spotify.com/v1/me/tracks?ids=${songId}`;

      const method = isLiked ? 'DELETE' : 'PUT';

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isLiked ? 'unlike' : 'like'} song`);
      }

      setIsLiked(!isLiked);
      setActionStatus({
        type: 'success',
        message: isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs'
      });
      
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error("Error liking song:", err);
      setActionStatus({
        type: 'error',
        message: err.message
      });
    }
  };

  const handleQueue = async () => {
    try {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${songId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to add song to queue`);
      }

      setActionStatus({
        type: 'success',
        message: 'Added to queue'
      });
      
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error("Error adding to queue:", err);
      setActionStatus({
        type: 'error',
        message: err.message
      });
    }
  };

  const handleAddToPlaylist = async () => {
    // In a real app, you'd show a playlist selection modal
    try {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        throw new Error("Authentication required");
      }

      // For demo, we'll use a default playlist ID
      const playlistId = '37i9dQZF1DX0XUsuxWHRQd'; // Your playlist ID here
      
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [`spotify:track:${songId}`]
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add song to playlist`);
      }

      setActionStatus({
        type: 'success',
        message: 'Added to playlist'
      });
      
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error("Error adding to playlist:", err);
      setActionStatus({
        type: 'error',
        message: err.message
      });
    }
  };

  const dismissActionStatus = () => {
    setActionStatus({ type: null, message: null });
  };

  if (loading) {
    return (
      <div className="song-card loading">
        <div className="song-card-placeholder" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="song-card error">
        <FiAlertCircle className="error-icon" />
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="song-card">
      {song && (
        <>
          <div className="song-image-container">
            <img 
              src={song.album.images[0]?.url || '/default-song-image.png'} 
              alt={song.name}
              className="song-image"
            />
          </div>
          
          <div className="song-info">
            <h4 className="song-title">{song.name}</h4>
            <p className="song-artist">
              {song.artists.map(artist => artist.name).join(', ')}
            </p>
          </div>
          
          <div className="song-actions">
            <button 
              className={`action-button like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <FiHeart className={`heart-icon ${isLiked ? 'liked' : ''}`} />
            </button>
            
            <button 
              className="action-button queue-button"
              onClick={handleQueue}
              aria-label="Add to queue"
            >
              <FiPlus />
            </button>
            
            <button 
              className="action-button playlist-button"
              onClick={handleAddToPlaylist}
              aria-label="Add to playlist"
            >
              <FiList />
            </button>
          </div>
          
          {actionStatus.message && (
            <div className={`action-status ${actionStatus.type}`}>
              {actionStatus.type === 'success' ? (
                <FiCheck className="status-icon" />
              ) : (
                <FiAlertCircle className="status-icon" />
              )}
              <span>{actionStatus.message}</span>
              <button 
                className="dismiss-button"
                onClick={dismissActionStatus}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SongCard;