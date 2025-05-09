// src/components/PlayerBar.jsx
import React from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import { usePlayback } from './PlaybackContext';

const PlayerBar = () => {
  const { isPlaying, togglePlay } = usePlayback();

  return (
    <div style={{
      background: '#181818',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
    }}>
      <button onClick={togglePlay} style={{
        fontSize: '1.5rem',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        color: 'white'
      }}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
};

export default PlayerBar;
