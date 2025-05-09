import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomeContent from './components/HomeContent';
import PlayerBar from './components/PlayerBar';
import { PlaybackProvider } from './components/PlaybackContext'; // FIXED: Correct import
import QueueProfile from './components/QueueProfile';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import CreatePlaylist from './pages/CreatePlaylist';
import LikedSongs from './pages/LikedSongs';
import 'font-awesome/css/font-awesome.min.css'; // FontAwesome for queue icon

function App() {
  return (
    <PlaybackProvider> {/* ✅ Wrap the app inside the context provider */}
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div style={{
          flex: 1,
          marginLeft: '230px',
          paddingBottom: '90px',
          backgroundColor: '#121212',
          color: 'white',
          overflowY: 'auto',
        }}>
          <Routes>
            <Route path="/" element={<HomeContent />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/create-playlist" element={<CreatePlaylist />} />
            <Route path="/liked" element={<LikedSongs />} />
            <Route path="/queue" element={<QueueProfile />} />
          </Routes>
        </div>

        {/* Queue Button */}
        <Link to="/queue" style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#1db954',
          padding: '10px 20px',
          borderRadius: '30px',
          textDecoration: 'none',
          color: 'white',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <i className="fa fa-list-ul"></i>
        </Link>

        {/* PlayerBar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '230px',
          right: 0,
          zIndex: 10,
        }}>
          <PlayerBar />
        </div>
      </div>
    </PlaybackProvider>
  );
}

export default App;
