import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PlayerBar from "../components/PlayerBar";
import { fetchAllSongs, getRecentlyPlayed } from "../Services/api";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showAllRecommended, setShowAllRecommended] = useState(false);

  const [recentItems, setRecentItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch recent and recommended songs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recentRes, recommendedRes] = await Promise.all([
          getRecentlyPlayed(),
          fetchAllSongs(), // Assuming this is your recommended fallback
        ]);

        setRecentItems(recentRes.data || []);
        setRecommendedItems(recommendedRes.data || []);
      } catch (err) {
        setError("Failed to load songs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedRecent = showAllRecent ? recentItems : recentItems.slice(0, 6);
  const displayedRecommended = showAllRecommended ? recommendedItems : recommendedItems.slice(0, 6);

  return (
    <div style={styles.container(isMobile)}>
      <Sidebar />
      <div style={styles.mainContent}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <div style={styles.header}>
              <h1 style={styles.greeting}>Good evening</h1>

              <div style={styles.recentGrid}>
                {displayedRecent.map((item, idx) => (
                  <div key={idx} style={styles.recentCard}>
                    <div style={styles.cardImage}></div>
                    <span style={styles.cardTitle}>{item.title || item}</span>
                  </div>
                ))}
              </div>

              {recentItems.length > 6 && !showAllRecent && (
                <button style={styles.showMoreButton} onClick={() => setShowAllRecent(true)}>
                  Show More
                </button>
              )}
            </div>

            <h2 style={styles.sectionTitle}>Recommended for you</h2>
            <div style={styles.recommendGrid}>
              {displayedRecommended.map((item, idx) => (
                <div key={idx} style={styles.recommendCard}>
                  <div style={styles.squareImage}></div>
                  <span style={styles.cardTitle}>{item.title || item}</span>
                </div>
              ))}
            </div>

            {recommendedItems.length > 6 && !showAllRecommended && (
              <button style={styles.showMoreButton} onClick={() => setShowAllRecommended(true)}>
                Show More
              </button>
            )}
          </>
        )}
      </div>
      <PlayerBar />
    </div>
  );
};

export default Home;

// ...styles (no changes here, keep same styles object)
