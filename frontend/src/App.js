import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home'; // or HomeContent
import AudioPlayer from './components/AudioPlayer';

const isAuthenticated = () => !!localStorage.getItem('token');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
      {isAuthenticated() && <AudioPlayer />}
    </Router>
  );
}

export default App;
