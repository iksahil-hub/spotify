// context/PlayerContext.jsx
import { createContext, useState, useContext } from 'react';

const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playSong = (song, queueList = []) => {
    const index = queueList.findIndex((s) => s.id === song.id);
    setQueue(queueList);
    setCurrentIndex(index);
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
      setIsPlaying(true);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
      setIsPlaying(true);
    }
  };

  const contextValue = {
    currentSong,
    isPlaying,
    playSong,
    setIsPlaying,
    queue,
    setQueue,
    playNext,
    playPrev,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};
