import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";

// Dynamic fetch function for playlists
const getUserPlaylists = async () => {
  return await API.get("/playlists");
};

const CreatePlaylist = () => {
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await getUserPlaylists();
      setPlaylists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playlistName.trim()) {
      setError("Please enter a playlist name.");
      return;
    }

    try {
      const res = await API.post("/playlists", { name: playlistName });
      setPlaylistName("");
      setSuccess(true);
      setError("");
      fetchPlaylists(); // refresh playlists
      setTimeout(() => {
        navigate(`/playlist/${res.data.id}`);
      }, 1000); // short delay before navigating
    } catch (err) {
      console.error(err);
      setError("Failed to create playlist. Please try again.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#121212",
      fontFamily: "Arial, sans-serif",
      color: "#fff",
      padding: "40px 20px",
    },
    card: {
      backgroundColor: "#000",
      padding: "40px",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 4px 60px rgba(0,0,0,0.5)",
      textAlign: "center",
      marginBottom: "40px",
    },
    title: {
      fontSize: "24px",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "16px",
      marginBottom: "16px",
      borderRadius: "4px",
      border: "none",
      background: "#333",
      color: "#fff",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#1DB954",
      border: "none",
      borderRadius: "4px",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "8px",
    },
    link: {
      display: "block",
      marginTop: "12px",
      fontSize: "12px",
      color: "#b3b3b3",
      textDecoration: "none",
    },
    error: {
      color: "#e22134",
      fontSize: "12px",
      marginBottom: "12px",
    },
    success: {
      color: "#1DB954",
      fontSize: "12px",
      marginBottom: "12px",
    },
    list: {
      width: "100%",
      maxWidth: "400px",
      background: "#181818",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    },
    listTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    playlistItem: {
      padding: "10px",
      borderBottom: "1px solid #333",
      color: "#ccc",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>Create a new playlist</div>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>Playlist created successfully!</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Playlist name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Create
          </button>
        </form>
        <a href="/home" style={styles.link}>
          Back to Home
        </a>
      </div>

      {/* Playlist List */}
      <div style={styles.list}>
        <div style={styles.listTitle}>Your Playlists</div>
        {playlists.length === 0 ? (
          <div style={styles.playlistItem}>No playlists yet.</div>
        ) : (
          playlists.map((playlist) => (
            <div key={playlist.id} style={styles.playlistItem}>
              🎵 {playlist.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreatePlaylist;
