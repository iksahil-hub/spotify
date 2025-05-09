// src/spotify.js
const authEndpoint = 'https://accounts.spotify.com/authorize';
const redirectUri = 'http://localhost:3000/auth/callback';
const clientId = 'YOUR_CLIENT_ID'; // Replace with your Client ID

const scopes = [
  'user-read-private',
  'user-read-email',
  'streaming',
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;