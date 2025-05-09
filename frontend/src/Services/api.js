// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',  // <- note the leading space
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================
// AUTH
// ==================
export const loginUser = (credentials) => api.post('/login', credentials);
export const signupUser = (data) => api.post('/signup', data);

// ==================
// SONGS
// ==================
export const fetchAllSongs = () => api.get('/songs');
export const addNewSong = (songData) => api.post('/songs', songData);
export const getSongById = (songId) => api.get(`/songs/${songId}`);
export const searchSongs = (query) => api.get(`/songs/search?q=${query}`);
export const filterSongsByTag = (tagName) => api.get(`/songs/tag/${tagName}`);
export const likeSong = (songId) => api.post(`/songs/${songId}/like`);
export const addToQueue = (songId) => api.post(`/songs/${songId}/queue`);

// ==================
// PLAYLISTS
// ==================
export const createPlaylist = (playlistData) => api.post('/playlists', playlistData);
export const getPlaylistById = (playlistId) => api.get(`/playlists/${playlistId}`);
export const addSongToPlaylist = (playlistId, songId) =>
  api.post(`/playlists/${playlistId}/songs`, { song_id: songId });
export const removeSongFromPlaylist = (playlistId, songId) =>
  api.delete(`/playlists/${playlistId}/songs/${songId}`);

// ==================
// PLAYBACK QUEUE
// ==================
export const getPlaybackQueue = () => api.get('/queue');
export const removeFromQueue = (songId) => api.delete(`/queue/${songId}`);
export const getRecentlyPlayed = () => api.get('/recent');

export default api;

// Play a song from the queue
export const playSong = (songId) => api.post(`/queue/play/${songId}`);

// Search songs (for search page)
export const fetchSongsBySearch = (query) => api.get(`/songs/search?q=${query}`);


