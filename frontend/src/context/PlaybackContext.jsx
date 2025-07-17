import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

// Create context with default values
const PlaybackContext = createContext({
  songQueue: [],
  currentIndex: 0,
  isPlaying: false,
  isLoading: true,
  error: null,
  deviceId: null,
  currentTrack: null,
  progress: 0,
  volume: 50,
  playSongAtIndex: () => {},
  addToQueue: () => {},
  playNext: () => {},
  playPrev: () => {},
  togglePlay: () => {},
  seekTo: () => {},
  setVolume: () => {},
  getPlaybackState: () => ({}),
});

// Provider component
export const PlaybackProvider = ({ children }) => {
  const [songQueue, setSongQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  
  // Reference to store interval ID for polling
  const pollingIntervalRef = useRef(null);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const initializeSpotifyPlayer = async () => {
      try {
        // Load Spotify Web Playback SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        // Wait for SDK to be ready
        await new Promise((resolve) => {
          window.onSpotifyWebPlaybackSDKReady = resolve;
        });

        // Create player instance
        const player = new window.Spotify.Player({
          name: 'Spotify Clone Player',
          getOAuthToken: cb => {
            const token = localStorage.getItem('spotify_token');
            cb(token);
          },
          volume: volume / 100
        });

        // Set up event listeners
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          setIsLoading(false);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setDeviceId(null);
          setIsLoading(true);
        });

        player.addListener('player_state_changed', (state) => {
          if (!state) return;
          
          // Update state based on player changes
          if (state.track) {
            setCurrentTrack(state.track);
            // Find index in queue
            const index = songQueue.findIndex(song => song.id === state.track.id);
            if (index !== -1) {
              setCurrentIndex(index);
            }
          }
          
          setIsPlaying(state.paused !== true);
          setProgress(state.position || 0);
        });

        player.connect();
      } catch (err) {
        console.error('Error initializing Spotify player:', err);
        setError('Failed to initialize player');
        setIsLoading(false);
      }
    };

    initializeSpotifyPlayer();

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Fetch current playback state from Spotify API
  const fetchPlaybackState = async () => {
    try {
      const token = localStorage.getItem('spotify_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get('https://api.spotify.com/v1/me/player', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        // Update queue with current context
        if (response.data.context) {
          const queue = await fetchQueueFromContext(response.data.context.uri);
          setSongQueue(queue);
          setCurrentIndex(response.data.progress_ms ? 
            queue.findIndex(item => item.id === response.data.item.id) : 0);
        }
        
        setIsPlaying(response.data.is_playing);
        setCurrentTrack(response.data.item);
        setProgress(response.data.progress_ms || 0);
      }
    } catch (err) {
      console.error('Error fetching playback state:', err);
    }
  };

  // Fetch queue from Spotify context
  const fetchQueueFromContext = async (contextUri) => {
    try {
      const token = localStorage.getItem('spotify_token');
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${contextUri.split(':')[2]}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data.tracks.items.map(track => ({
        id: track.track.id,
        name: track.track.name,
        artists: track.track.artists.map(artist => artist.name),
        album: track.track.album.name,
        image: track.track.album.images[0]?.url,
        duration: track.track.duration_ms,
        uri: track.track.uri
      }));
    } catch (err) {
      console.error('Error fetching queue:', err);
      return [];
    }
  };

  // Start polling for playback updates
  useEffect(() => {
    if (!isLoading) {
      pollingIntervalRef.current = setInterval(fetchPlaybackState, 5000);
    }
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isLoading]);

  // Play a specific song by index
  const playSongAtIndex = async (index) => {
    if (index >= 0 && index < songQueue.length) {
      try {
        const token = localStorage.getItem('spotify_token');
        await axios.put('https://api.spotify.com/v1/me/player/play', {
          uris: [songQueue[index].uri],
          position_ms: 0
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCurrentIndex(index);
        setIsPlaying(true);
      } catch (err) {
        console.error('Error playing song:', err);
      }
    }
  };

  // Add songs to the queue (replace or append)
  const addToQueue = async (songs, replace = true) => {
    try {
      const token = localStorage.getItem('spotify_token');
      const uris = songs.map(song => song.uri);
      
      if (replace) {
        // Replace current queue
        await axios.put('https://api.spotify.com/v1/me/player/play', {
          uris: [uris[0]],
          position_ms: 0
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSongQueue(songs);
        setCurrentIndex(0);
        setIsPlaying(true);
      } else {
        // Append to queue
        await axios.post('https://api.spotify.com/v1/me/player/queue', {
          uri: uris[0]
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSongQueue(prev => [...prev, ...songs]);
      }
    } catch (err) {
      console.error('Error adding to queue:', err);
    }
  };

  // Next song
  const playNext = async () => {
    if (currentIndex < songQueue.length - 1) {
      await playSongAtIndex(currentIndex + 1);
    } else {
      // If at end of queue, get next recommendations
      const token = localStorage.getItem('spotify_token');
      const response = await axios.get('https://api.spotify.com/v1/recommendations', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          seed_artists: currentTrack?.artists[0]?.id,
          limit: 1
        }
      });
      
      if (response.data.tracks.length > 0) {
        await addToQueue(response.data.tracks, false);
        await playSongAtIndex(currentIndex + 1);
      }
    }
  };

  // Previous song
  const playPrev = async () => {
    if (currentIndex > 0) {
      await playSongAtIndex(currentIndex - 1);
    } else {
      // If at beginning, restart current song
      await playSongAtIndex(0);
    }
  };

  // Toggle play/pause
  const togglePlay = async () => {
    try {
      const token = localStorage.getItem('spotify_token');
      await axios.put(`https://api.spotify.com/v1/me/player/${isPlaying ? 'pause' : 'play'}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Error toggling play:', err);
    }
  };

  // Seek to position
  const seekTo = async (position_ms) => {
    try {
      const token = localStorage.getItem('spotify_token');
      await axios.put('https://api.spotify.com/v1/me/player/seek', {
        position_ms
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error seeking:', err);
    }
  };

  // Set volume
  const setVolumeAction = async (volume) => {
    try {
      const token = localStorage.getItem('spotify_token');
      await axios.put('https://api.spotify.com/v1/me/player/volume', {
        volume_percent: volume
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setVolume(volume);
    } catch (err) {
      console.error('Error setting volume:', err);
    }
  };

  // Get current playback state
  const getPlaybackState = () => {
    return {
      song: currentTrack,
      progress,
      duration: currentTrack?.duration || 0,
      isPlaying
    };
  };

  return (
    <PlaybackContext.Provider
      value={{
        songQueue,
        currentIndex,
        isPlaying,
        isLoading,
        error,
        deviceId,
        currentTrack,
        progress,
        volume,
        playSongAtIndex,
        addToQueue,
        playNext,
        playPrev,
        togglePlay,
        seekTo,
        setVolume: setVolumeAction,
        getPlaybackState,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

// Custom hook for easy usage
export const usePlayback = () => useContext(PlaybackContext);