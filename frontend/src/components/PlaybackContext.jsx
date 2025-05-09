// src/components/PlaybackContext.jsx
import React, { createContext, useContext, useState } from 'react';

const PlaybackContext = createContext();

export const usePlayback = () => useContext(PlaybackContext);

export const PlaybackProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => setIsPlaying(prev => !prev);
  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  const addToQueue = (track) => setQueue(prev => [...prev, track]);

  return (
    <PlaybackContext.Provider value={{
      isPlaying,
      currentTrack,
      queue,
      volume,
      setVolume,
      togglePlay,
      playTrack,
      addToQueue,
    }}>
      {children}
    </PlaybackContext.Provider>
  );
};
