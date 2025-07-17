import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiBook, FiPlusSquare, FiHeart, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('spotify_token');
        if (!token) return;

        // Fetch user profile
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data);

        // Fetch user playlists
        const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10 }
        });
        setPlaylists(playlistsResponse.data.items);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine if a link is active based on current route
  const isActive = (path) => location.pathname === path;

  if (loading) {
    return <div style={styles.sidebar}>Loading...</div>;
  }

  return (
    <div style={{ ...styles.sidebar, width: isCollapsed ? '70px' : '230px' }}>
      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logo}>
          <Link to="/" style={styles.logoLink}>
            <img
              src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png"
              alt="Spotify"
              style={{ width: isCollapsed ? '40px' : '130px', marginBottom: isCollapsed ? 0 : '30px' }}
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          <Link to="/" style={{ ...styles.link, ...(isActive('/') && styles.activeLink) }}>
            <FiHome style={{ ...styles.icon, ...(isActive('/') && styles.activeIcon) }} />
            {!isCollapsed && 'Home'}
          </Link>
          <Link to="/search" style={{ ...styles.link, ...(isActive('/search') && styles.activeLink) }}>
            <FiSearch style={{ ...styles.icon, ...(isActive('/search') && styles.activeIcon) }} />
            {!isCollapsed && 'Search'}
          </Link>
          <Link to="/library" style={{ ...styles.link, ...(isActive('/library') && styles.activeLink) }}>
            <FiBook style={{ ...styles.icon, ...(isActive('/library') && styles.activeIcon) }} />
            {!isCollapsed && 'Your Library'}
          </Link>
        </nav>

        {/* User Library Section */}
        {!isCollapsed && (
          <div style={styles.library}>
            <Link to="/create-playlist" style={{ ...styles.link, ...(isActive('/create-playlist') && styles.activeLink) }}>
              <FiPlusSquare style={{ ...styles.icon, ...(isActive('/create-playlist') && styles.activeIcon) }} />
              Create Playlist
            </Link>
            <Link to="/liked" style={{ ...styles.link, ...(isActive('/liked') && styles.activeLink) }}>
              <FiHeart style={{ ...styles.icon, ...(isActive('/liked') && styles.activeIcon) }} />
              Liked Songs
            </Link>
          </div>
        )}

        {/* User Playlists */}
        {!isCollapsed && user && (
          <div style={styles.playlistsSection}>
            <h3 style={styles.sectionTitle}>Your Playlists</h3>
            {playlists.map(playlist => (
              <Link 
                key={playlist.id} 
                to={`/playlist/${playlist.id}`}
                style={{ ...styles.playlistLink, ...(isActive(`/playlist/${playlist.id}`) && styles.activeLink) }}
              >
                <div style={styles.playlistItem}>
                  <img 
                    src={playlist.images[0]?.url || '/default-playlist.png'} 
                    alt={playlist.name}
                    style={styles.playlistImage}
                  />
                  <span style={styles.playlistName}>{playlist.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* User Profile */}
        {!isCollapsed && user && (
          <div style={styles.profileSection}>
            <div style={styles.profileInfo}>
              <img 
                src={user.images[0]?.url || '/default-avatar.png'} 
                alt={user.display_name}
                style={styles.avatar}
              />
              <div style={styles.profileDetails}>
                <h4 style={styles.profileName}>{user.display_name}</h4>
                <p style={styles.profileType}>{user.product || 'Free'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        style={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: '#000',
    color: '#b3b3b3',
    padding: '20px',
    height: '100vh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 10,
    transition: 'width 0.3s ease',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  logo: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#b3b3b3',
    fontSize: '16px',
    gap: '15px',
    padding: '10px 15px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#282828',
      color: '#1DB954',
    },
  },
  activeLink: {
    backgroundColor: '#282828',
    color: '#1DB954',
    fontWeight: '500',
  },
  icon: {
    fontSize: '20px',
    minWidth: '24px',
    textAlign: 'center',
  },
  activeIcon: {
    color: '#1DB954',
  },
  library: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px',
  },
  playlistsSection: {
    marginBottom: '30px',
  },
  sectionTitle: {
    color: '#b3b3b3',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '15px',
  },
  playlistLink: {
    textDecoration: 'none',
    color: '#b3b3b3',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#1DB954',
    },
  },
  playlistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
  },
  playlistImage: {
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    objectFit: 'cover',
  },
  playlistName: {
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileSection: {
    marginTop: 'auto',
    borderTop: '1px solid #282828',
    paddingTop: '20px',
  },
  profileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileName: {
    fontSize: '16px',
    fontWeight: '500',
    margin: 0,
  },
  profileType: {
    fontSize: '12px',
    color: '#b3b3b3',
    margin: '4px 0 0',
  },
  toggleButton: {
    backgroundColor: '#282828',
    border: 'none',
    color: '#b3b3b3',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#333',
      color: '#1DB954',
    },
  },
};

export default Sidebar;