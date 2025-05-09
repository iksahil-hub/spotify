import React from "react";
import { likeSong, addToQueue, addSongToPlaylist } from "../Services/api";

const SongCard = ({ song, onAdded }) => {
  const handleLike = async () => {
    await likeSong(song.id);
    alert(`Liked "${song.title}"`);
  };

  const handleQueue = async () => {
    await addToQueue(song.id);
    alert(`Queued "${song.title}"`);
    if (onAdded) onAdded();
  };

  const handleAddToPlaylist = async () => {
    // For simplicity, we’ll add to playlist ID 1—adjust as needed
    const playlistId = 1;
    await addSongToPlaylist(playlistId, song.id);
    alert(`Added "${song.title}" to your playlist`);
    if (onAdded) onAdded();
  };

  const cardStyle = {
    background: "#181818",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    width: "200px",
    margin: "10px",
    textAlign: "left",
  };
  const btnStyle = {
    margin: "5px 5px 0 0",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
    <div style={cardStyle}>
      <h4>{song.title}</h4>
      <p style={{ color: "#bbb" }}>{song.artist}</p>
      <div>
        <button style={{ ...btnStyle, background: "#1db954" }} onClick={handleLike}>
          ♥ Like
        </button>
        <button style={{ ...btnStyle, background: "#404040" }} onClick={handleQueue}>
          ➕ Queue
        </button>
        <button style={{ ...btnStyle, background: "#404040" }} onClick={handleAddToPlaylist}>
          ⋯ Playlist
        </button>
      </div>
    </div>
  );
};

export default SongCard;
