// src/components/HomeContent.jsx
import React, { useState, useEffect } from 'react';
import { getRecentlyPlayed, fetchAllSongs } from '../Services/api';
import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';

const HomeContent = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, recRes] = await Promise.all([
          getRecentlyPlayed(),
          fetchAllSongs(),
        ]);
        setRecentItems(recentRes.data || []);
        setRecommended(recRes.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load songs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p style={{ color: '#fff', padding: '20px' }}>Loading...</p>;
  }
  if (error) {
    return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;
  }

  return (
    <div style={{ padding: '20px', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      {/* Good Evening */}
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>Good evening</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {recentItems.map((song) => (
          <div
            key={song.id}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              height: '60px',
              cursor: 'pointer',
            }}
            onClick={() => window.location.href = `/song/${song.id}`}
          >
            {song.cover_url ? (
              <img
                src={song.cover_url}
                alt={song.title}
                style={{ width: '50px', height: '50px', borderRadius: '4px', marginRight: '10px' }}
              />
            ) : (
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#444',
                  borderRadius: '4px',
                  marginRight: '10px',
                }}
              ></div>
            )}
            <span style={{ fontWeight: 'bold' }}>{song.title}</span>
          </div>
        ))}
      </div>

      {/* Recommended For You */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Recommended for you</h2>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '10px',
        }}
      >
        {recommended.map((song) => (
          <div
            key={song.id}
            style={{
              minWidth: '160px',
              backgroundColor: '#181818',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
            onClick={() => window.location.href = `/song/${song.id}`}
          >
            {song.cover_url ? (
              <img
                src={song.cover_url}
                alt={song.title}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: '6px',
                  marginBottom: '10px',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  paddingBottom: '100%',
                  backgroundColor: '#333',
                  borderRadius: '6px',
                  marginBottom: '10px',
                }}
              ></div>
            )}
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{song.title}</div>
            <div style={{ fontSize: '12px', color: '#b3b3b3' }}>{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeContent;
