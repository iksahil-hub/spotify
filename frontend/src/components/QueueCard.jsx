import React, { useState, useEffect } from "react";
import axios from "axios";

const QueueCard = ({ songId, onRemove, onPlay }) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const token = localStorage.getItem('spotify_token'); // Get token from storage
        const response = await axios.get(
          `https://api.spotify.com/v1/tracks/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSong(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load song details");
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [songId]);

  if (loading) return <div className="queue-card loading">Loading...</div>;
  if (error) return <div className="queue-card error">{error}</div>;

  return (
    <div className="queue-card">
      {song && (
        <>
          <img 
            src={song.album.images[0]?.url || "/default-thumbnail.png"} 
            alt={song.name} 
            className="queue-thumbnail" 
          />
          <div className="queue-details">
            <h3>{song.name}</h3>
            <p>{song.artists.map(artist => artist.name).join(", ")}</p>
            <div className="queue-actions">
              <button onClick={() => onPlay(song.id)}>Play</button>
              <button onClick={() => onRemove(song.id)}>Remove</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QueueCard;