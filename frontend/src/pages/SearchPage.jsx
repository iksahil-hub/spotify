import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import SongCard from "../components/SongCard";
import { fetchSongsBySearch } from "../Services/api";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetchSongsBySearch(query);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching search results", err);
    }
    setLoading(false);
  };
  

  const styles = {
    container: {
      backgroundColor: "#121212",
      color: "#fff",
      minHeight: "100vh",
      padding: "40px",
      boxSizing: "border-box",
    },
    form: {
      position: "relative",
      maxWidth: "600px",
      margin: "0 auto 40px",
    },
    input: {
      width: "100%",
      padding: "12px 40px",
      borderRadius: "25px",
      border: "none",
      backgroundColor: "#282828",
      color: "#fff",
      fontSize: "16px",
      outline: "none",
    },
    searchIcon: {
      position: "absolute",
      top: "50%",
      left: "15px",
      transform: "translateY(-50%)",
      color: "#b3b3b3",
      fontSize: "20px",
    },
    results: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "20px",
    },
    loading: {
      textAlign: "center",
      fontSize: "18px",
      color: "#b3b3b3",
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSearch}>
        <FiSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search for songs, artists, or podcasts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
      </form>
      {loading ? (
        <div style={styles.loading}>Loading...</div>
      ) : (
        <div style={styles.results}>
          {results.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
