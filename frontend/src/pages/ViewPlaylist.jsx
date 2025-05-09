// src/pages/ViewPlaylist.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById, addSongToPlaylist, removeSongFromPlaylist } from "../Services/api";  // Correct import

const ViewPlaylist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await getPlaylistById(playlistId); // Use the correct API method
        setPlaylist(response.data);
      } catch (error) {
        console.error("Error fetching playlist", error);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleAddSong = async (songId) => {
    try {
      await addSongToPlaylist(playlist.id, songId); // Add song to playlist via API
      // Re-fetch playlist or update UI to reflect changes
      setPlaylist((prevPlaylist) => ({
        ...prevPlaylist,
        songs: [...prevPlaylist.songs, { id: songId, title: "New Song" }], // Dynamically update list
      }));
    } catch (error) {
      console.error("Error adding song to playlist", error);
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      await removeSongFromPlaylist(playlist.id, songId); // Remove song from playlist via API
      // Re-fetch playlist or update UI to reflect changes
      setPlaylist((prevPlaylist) => ({
        ...prevPlaylist,
        songs: prevPlaylist.songs.filter((song) => song.id !== songId), // Filter out removed song
      }));
    } catch (error) {
      console.error("Error removing song from playlist", error);
    }
  };

  if (!playlist) return <div>Loading...</div>; // Loading state

  return (
    <div className="view-playlist-container">
      <h1>{playlist.name}</h1>
      <h2>Songs</h2>
      <ul>
        {playlist.songs.map((song) => (
          <li key={song.id}>
            {song.title} by {song.artist}
            <button onClick={() => handleRemoveSong(song.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleAddSong(123)}>Add New Song</button> {/* Example Add */}
    </div>
  );
};

export default ViewPlaylist;
