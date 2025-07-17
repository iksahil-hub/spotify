// components/AudioPlayer.jsx
import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

const AudioPlayer = () => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    playNext,
    playPrev,
  } = usePlayer();

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  if (!currentSong) return null;

  return (
    <div className="audio-player">
      <h4>{currentSong.title}</h4>
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onEnded={playNext}
        controls
      />
      <div className="controls">
        <button onClick={playPrev}>⏮ Prev</button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸ Pause' : '▶️ Play'}
        </button>
        <button onClick={playNext}>⏭ Next</button>
      </div>
    </div>
  );
};

export default AudioPlayer;
